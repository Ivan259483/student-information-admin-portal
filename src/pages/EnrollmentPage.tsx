import { useState, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  Eye,
  Printer,
  AlertTriangle,
  FileText,
  ClipboardCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { enrollments as initialEnrollments } from '@/data/mock-data';
import { programOptions } from '@/data/mock-data';
import type { Enrollment } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [rejectEnrollment, setRejectEnrollment] = useState<Enrollment | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [corEnrollment, setCorEnrollment] = useState<Enrollment | null>(null);

  const filtered = useMemo(() => {
    return enrollments.filter((en) => {
      const matchTab = activeTab === 'all' || en.status === activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      const matchSearch =
        en.studentName.toLowerCase().includes(search.toLowerCase()) ||
        en.studentNumber.includes(search);
      const matchProgram = programFilter === 'all' || en.program === programFilter;
      return matchTab && matchSearch && matchProgram;
    });
  }, [enrollments, activeTab, search, programFilter]);

  const counts = useMemo(() => ({
    all: enrollments.length,
    pending: enrollments.filter((e) => e.status === 'Pending').length,
    approved: enrollments.filter((e) => e.status === 'Approved').length,
    rejected: enrollments.filter((e) => e.status === 'Rejected').length,
  }), [enrollments]);

  const handleApprove = (enrollment: Enrollment) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === enrollment.id ? { ...e, status: 'Approved', remarks: '' } : e))
    );
    setSelectedEnrollment((prev) => prev ? { ...prev, status: 'Approved', remarks: '' } : prev);
    toast.success('Enrollment approved', { description: `${enrollment.studentName}'s enrollment has been approved.` });
  };

  const handleReject = () => {
    if (rejectEnrollment && rejectRemarks.trim()) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === rejectEnrollment.id ? { ...e, status: 'Rejected', remarks: rejectRemarks.trim() } : e))
      );
      setSelectedEnrollment((prev) => prev ? { ...prev, status: 'Rejected', remarks: rejectRemarks.trim() } : prev);
      toast.success('Enrollment rejected', { description: `${rejectEnrollment.studentName}'s enrollment has been rejected.` });
      setRejectEnrollment(null);
      setRejectRemarks('');
    } else if (!rejectRemarks.trim()) {
      toast.error('Remarks required', { description: 'Please provide a reason for rejection.' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollment & COR"
        description="Review student enrollment requests and manage Certificates of Registration"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Enrollment & COR' }]}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programOptions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<ClipboardCheck className="h-6 w-6" />}
                  title="No enrollments found"
                  description="No enrollment requests match your current filters."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Student</TableHead>
                        <TableHead className="hidden md:table-cell">ID</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead className="hidden lg:table-cell">Section</TableHead>
                        <TableHead className="hidden sm:table-cell">Units</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((en) => (
                        <TableRow
                          key={en.id}
                          className="cursor-pointer"
                          onClick={() => setSelectedEnrollment(en)}
                        >
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                  {en.studentName.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-foreground">{en.studentName}</p>
                                <p className="text-xs text-muted-foreground">{en.program} · {en.yearLevel}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">{en.studentNumber}</TableCell>
                          <TableCell className="text-sm">{en.program}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{en.section}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{en.totalUnits} units</TableCell>
                          <TableCell><StatusBadge status={en.status} showDot /></TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedEnrollment(en); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enrollment Details Modal */}
      <Dialog open={!!selectedEnrollment} onOpenChange={(open) => !open && setSelectedEnrollment(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedEnrollment && (
            <>
              <DialogHeader>
                <DialogTitle>Enrollment Details</DialogTitle>
                <DialogDescription>
                  {selectedEnrollment.studentName} · {selectedEnrollment.studentNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Student Summary */}
                <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {selectedEnrollment.studentName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground">{selectedEnrollment.studentName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{selectedEnrollment.studentNumber}</p>
                  </div>
                  <StatusBadge status={selectedEnrollment.status} showDot />
                </div>

                {/* Academic Info */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Program', value: selectedEnrollment.program },
                    { label: 'Year Level', value: selectedEnrollment.yearLevel },
                    { label: 'Section', value: selectedEnrollment.section },
                    { label: 'Total Units', value: `${selectedEnrollment.totalUnits}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Prerequisite Concerns */}
                {selectedEnrollment.hasPrerequisiteConcerns && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Prerequisite Concern</p>
                      <p className="text-xs text-amber-700">
                        Some subjects have unmet prerequisites. Please review before approving.
                      </p>
                    </div>
                  </div>
                )}

                {/* Subjects */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Selected Subjects</h4>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Subject</TableHead>
                          <TableHead className="text-xs">Units</TableHead>
                          <TableHead className="text-xs">Prerequisite</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEnrollment.subjects.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-mono text-xs">{sub.code}</TableCell>
                            <TableCell className="text-xs">
                              {sub.title}
                              {!sub.hasPrerequisiteMet && sub.prerequisite && (
                                <span className="ml-2 inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                                  <AlertTriangle className="h-3 w-3" />
                                  Needs {sub.prerequisite}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">{sub.units}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{sub.prerequisite || 'None'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Rejection Remarks */}
                {selectedEnrollment.status === 'Rejected' && selectedEnrollment.remarks && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">Rejection Remarks</p>
                    <p className="mt-1 text-sm text-red-700">{selectedEnrollment.remarks}</p>
                  </div>
                )}

                {/* Actions */}
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {selectedEnrollment.status === 'Pending' && (
                    <>
                      <Button className="gap-2" onClick={() => handleApprove(selectedEnrollment)}>
                        <Check className="h-4 w-4" />
                        Approve Enrollment
                      </Button>
                      <Button variant="destructive" className="gap-2" onClick={() => { setRejectEnrollment(selectedEnrollment); setRejectRemarks(''); }}>
                        <X className="h-4 w-4" />
                        Reject Enrollment
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="gap-2" onClick={() => setCorEnrollment(selectedEnrollment)}>
                    <FileText className="h-4 w-4" />
                    View COR
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectEnrollment} onOpenChange={(open) => { if (!open) { setRejectEnrollment(null); setRejectRemarks(''); } }}>
        <DialogContent className="max-w-md">
          {rejectEnrollment && (
            <>
              <DialogHeader>
                <DialogTitle>Reject Enrollment</DialogTitle>
                <DialogDescription>
                  Provide a reason for rejecting {rejectEnrollment.studentName}'s enrollment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter rejection remarks..."
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setRejectEnrollment(null); setRejectRemarks(''); }}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* COR Preview Modal */}
      <Dialog open={!!corEnrollment} onOpenChange={(open) => !open && setCorEnrollment(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {corEnrollment && (
            <>
              <div className="no-print flex items-center justify-between">
                <DialogHeader className="flex-1">
                  <DialogTitle>Certificate of Registration</DialogTitle>
                  <DialogDescription>Printable preview</DialogDescription>
                </DialogHeader>
                <Button className="gap-2 no-print" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>

              {/* Printable COR */}
              <div className="print-area rounded-lg border border-border p-8">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-foreground">University Admin Portal</h1>
                  <p className="text-sm text-muted-foreground">Office of the Registrar</p>
                  <Separator className="my-3" />
                  <h2 className="text-lg font-bold text-foreground">Certificate of Registration</h2>
                  <p className="text-xs text-muted-foreground">Academic Year {corEnrollment.program === 'BSIT' ? '2024-2025' : '2024-2025'} · 1st Semester</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Student Name</p>
                    <p className="font-semibold text-foreground">{corEnrollment.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Student Number</p>
                    <p className="font-semibold text-foreground font-mono">{corEnrollment.studentNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Program</p>
                    <p className="font-semibold text-foreground">{corEnrollment.program}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Year Level & Section</p>
                    <p className="font-semibold text-foreground">{corEnrollment.yearLevel} · {corEnrollment.section}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs font-semibold">Code</TableHead>
                      <TableHead className="text-xs font-semibold">Subject</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corEnrollment.subjects.map((sub) => (
                      <TableRow key={sub.id} className="border-border">
                        <TableCell className="font-mono text-xs">{sub.code}</TableCell>
                        <TableCell className="text-xs">{sub.title}</TableCell>
                        <TableCell className="text-xs text-center">{sub.units}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 border-border">
                      <TableCell className="font-semibold text-sm" colSpan={2}>Total Units</TableCell>
                      <TableCell className="font-semibold text-sm text-center">{corEnrollment.totalUnits}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-8 flex justify-between text-sm">
                  <div>
                    <div className="border-t border-foreground pt-1 w-40">
                      <p className="text-xs text-muted-foreground">Student Signature</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-foreground pt-1 w-40">
                      <p className="text-xs text-muted-foreground">Registrar Signature</p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  This certificate is a system-generated document from the University Admin Portal.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
