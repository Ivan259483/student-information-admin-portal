import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardCheck,
  GraduationCap,
  LifeBuoy,
  Megaphone,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  enrollments,
  supportTickets,
  announcements,
  activityLogs,
  gradeRecords,
  enrollmentStatusData,
  studentsByProgramData,
  ticketStatusData,
} from '@/data/mock-data';
import { cn } from '@/lib/utils';

const kpiCards = [
  {
    label: 'Total Students',
    value: '12',
    icon: Users,
    change: '+3 this semester',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Pending Enrollments',
    value: '4',
    icon: ClipboardCheck,
    change: '2 new today',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Published Grades',
    value: '8',
    icon: GraduationCap,
    change: '2 drafts pending',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Open Support Tickets',
    value: '3',
    icon: LifeBuoy,
    change: '1 urgent',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    label: 'Active Announcements',
    value: '4',
    icon: Megaphone,
    change: '2 drafts',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Current Semester',
    value: 'AY 24-25',
    sub: '1st Semester',
    icon: CalendarDays,
    change: 'Enrollment open',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
];

const enrollmentChartConfig: ChartConfig = {
  value: { label: 'Enrollments' },
  Pending: { label: 'Pending', color: 'hsl(38, 92%, 50%)' },
  Approved: { label: 'Approved', color: 'hsl(142, 71%, 45%)' },
  Rejected: { label: 'Rejected', color: 'hsl(0, 84%, 60%)' },
};

const programChartConfig: ChartConfig = {
  students: { label: 'Students', color: 'hsl(217, 91%, 50%)' },
};

const ticketChartConfig: ChartConfig = {
  value: { label: 'Tickets' },
  Open: { label: 'Open', color: 'hsl(217, 91%, 50%)' },
  'In Progress': { label: 'In Progress', color: 'hsl(38, 92%, 50%)' },
  Resolved: { label: 'Resolved', color: 'hsl(142, 71%, 45%)' },
};

const activityIcons = {
  enrollment: { icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  grade: { icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
  announcement: { icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  ticket: { icon: LifeBuoy, color: 'text-amber-600', bg: 'bg-amber-50' },
  student: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  schedule: { icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
  settings: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
};

export function DashboardPage() {
  const navigate = useNavigate();
  const recentEnrollments = enrollments.slice(0, 4);
  const recentTickets = supportTickets.slice(0, 4);
  const recentAnnouncements = announcements.filter((a) => a.status === 'Published').slice(0, 3);
  const recentActivity = activityLogs.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of university administration activities"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', kpi.bg)}>
                    <Icon className={cn('h-5 w-5', kpi.color)} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                {kpi.sub && <p className="text-xs font-medium text-foreground">{kpi.sub}</p>}
                <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
                {kpi.change && (
                  <p className="mt-1 text-xs text-muted-foreground">{kpi.change}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment Status</CardTitle>
            <CardDescription>Current semester breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={enrollmentChartConfig} className="mx-auto aspect-square h-[200px]">
              <PieChart>
                <Pie
                  data={enrollmentStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {enrollmentStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex items-center justify-center gap-4">
              {enrollmentStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Students by Program</CardTitle>
            <CardDescription>Enrollment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={programChartConfig} className="aspect-square h-[200px] w-full">
              <BarChart data={studentsByProgramData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="hsl(217, 91%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ticket Status Overview</CardTitle>
            <CardDescription>Support helpdesk summary</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ticketChartConfig} className="mx-auto aspect-square h-[200px]">
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {ticketStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex items-center justify-center gap-4">
              {ticketStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/students')}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/enrollment')}>
              <ClipboardCheck className="h-4 w-4" />
              Review Enrollments
            </Button>
            <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/announcements')}>
              <Megaphone className="h-4 w-4" />
              New Announcement
            </Button>
            <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/grades')}>
              <GraduationCap className="h-4 w-4" />
              Encode Grades
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Enrollment Requests</CardTitle>
              <CardDescription>Latest submissions awaiting review</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/enrollment')}>
              View all
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEnrollments.map((en) => (
              <div key={en.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {en.studentName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{en.studentName}</p>
                    <p className="text-xs text-muted-foreground">{en.program} · {en.yearLevel} · {en.totalUnits} units</p>
                  </div>
                </div>
                <StatusBadge status={en.status} showDot />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Support Tickets</CardTitle>
              <CardDescription>Latest student concerns</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/helpdesk')}>
              View all
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {ticket.studentName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.studentName} · {ticket.category}</p>
                  </div>
                </div>
                <StatusBadge status={ticket.status} showDot />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Announcements + Activity Feed */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Announcements</CardTitle>
              <CardDescription>Latest published posts</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/announcements')}>
              View all
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((an) => (
              <div key={an.id} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{an.title}</p>
                  <StatusBadge status={an.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{an.message}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Megaphone className="h-3 w-3" />
                  {an.category} · {an.targetValue} · {an.datePublished}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>System action log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.map((log) => {
                const config = activityIcons[log.type];
                const Icon = config.icon;
                return (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/30">
                    <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', config.bg)}>
                      <Icon className={cn('h-3.5 w-3.5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {log.actor} · {log.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
