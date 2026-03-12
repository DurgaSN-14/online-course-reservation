import { Outlet } from "react-router";
import InstructorSidebar from "../pages/instructor/InstructorSidebar";
import InstructorTopbar from "../pages/instructor/InstructorTopbar";

const InstructorLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <InstructorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <InstructorTopbar />

        <main className="flex-1 overflow-y-auto p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
