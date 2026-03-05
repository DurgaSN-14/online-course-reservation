import { Outlet } from "react-router";
import StudentSidebar from "../pages/student/StudentSidebar";
import StudentTopbar from "../pages/student/StudentTopbar";

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
