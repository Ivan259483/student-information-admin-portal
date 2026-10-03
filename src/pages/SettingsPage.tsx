import { useState } from 'react';
import {
  Save,
  Check,
  CalendarDays,
  GraduationCap,
  ClipboardCheck,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { initialSettings } from '@/data/mock-data';
import type { SystemSettings } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved', { description: 'System settings have been updated successfully.' });
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure school system controls and preferences"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Settings' }]}
        actions={
          <Button className="gap-2" onClick={handleSave} disabled={saved}>
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        }
      />

      {/* Academic Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Academic Settings</CardTitle>
              <CardDescription>Current academic year and semester</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={settings.academicYear}
                onChange={(e) => updateSetting('academicYear', e.target.value)}
                placeholder="e.g. 2024-2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={settings.semester}
                onValueChange={(v) => updateSetting('semester', v)}
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Enrollment Controls</CardTitle>
              <CardDescription>Manage enrollment availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enrollment Open</Label>
              <p className="text-xs text-muted-foreground">
                Allow students to submit enrollment requests
              </p>
            </div>
            <Switch
              checked={settings.enrollmentOpen}
              onCheckedChange={(v) => updateSetting('enrollmentOpen', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grade Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Grade Controls</CardTitle>
              <CardDescription>Manage grade encoding availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Grade Encoding Open</Label>
              <p className="text-xs text-muted-foreground">
                Allow instructors and admins to encode grades
              </p>
            </div>
            <Switch
              checked={settings.gradeEncodingOpen}
              onCheckedChange={(v) => updateSetting('gradeEncodingOpen', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose which alerts you want to receive</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">New Enrollment Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when a student submits an enrollment request
              </p>
            </div>
            <Switch
              checked={settings.notifyNewEnrollments}
              onCheckedChange={(v) => updateSetting('notifyNewEnrollments', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">New Ticket Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when a student opens a support ticket
              </p>
            </div>
            <Switch
              checked={settings.notifyNewTickets}
              onCheckedChange={(v) => updateSetting('notifyNewTickets', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">System Activity Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified about general system actions and changes
              </p>
            </div>
            <Switch
              checked={settings.notifySystemActivity}
              onCheckedChange={(v) => updateSetting('notifySystemActivity', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave} disabled={saved}>
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
