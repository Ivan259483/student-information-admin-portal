import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentDirectoryPage } from '@/pages/StudentDirectoryPage';
import { EnrollmentPage } from '@/pages/EnrollmentPage';
import { AcademicRecordsPage } from '@/pages/AcademicRecordsPage';
import { ClassSchedulesPage } from '@/pages/ClassSchedulesPage';
import { AnnouncementsPage } from '@/pages/AnnouncementsPage';
import { SupportHelpdeskPage } from '@/pages/SupportHelpdeskPage';
import { SettingsPage } from '@/pages/SettingsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/students" element={<StudentDirectoryPage />} />
          <Route path="/enrollment" element={<EnrollmentPage />} />
          <Route path="/grades" element={<AcademicRecordsPage />} />
          <Route path="/schedules" element={<ClassSchedulesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/helpdesk" element={<SupportHelpdeskPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <SonnerToaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
