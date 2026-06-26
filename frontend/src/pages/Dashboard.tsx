import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import axios from "axios"
import {
  FaCalendarAlt,
  FaGlobe,
  FaExternalLinkAlt,
  FaTrash,
  FaEdit,
  FaBriefcase,
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Application {
  id: number;
  companyName: string;
  role: string;
  status: string;
  applicationDate: string;
  platform: string;
  jobLink: string;
}

function Dashboard() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [companyName, setCompanyName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [status, setStatus] =
    useState("Applied");

  const [platform, setPlatform] =
  useState("");

  const [jobLink, setJobLink] =
  useState("");

  const [applicationDate,
  setApplicationDate] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  // Edit Modal State
const [isEditModalOpen, setIsEditModalOpen] =
  useState(false);

const [editingApplicationId, setEditingApplicationId] =
  useState<number | null>(null);

const [isUpdating, setIsUpdating] =
  useState(false);

// Edit Form Fields
const [editCompanyName, setEditCompanyName] =
  useState("");

const [editRole, setEditRole] =
  useState("");

const [editPlatform, setEditPlatform] =
  useState("");

const [editJobLink, setEditJobLink] =
  useState("");

const [editApplicationDate, setEditApplicationDate] =
  useState("");

const [editStatus, setEditStatus] =
  useState("Applied");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
  useState("All");

  const totalApplications =
    applications.length;

  const appliedCount =
    applications.filter(
      (app) =>
        app.status === "Applied"
    ).length;

  const interviewCount =
    applications.filter(
      (app) =>
        app.status === "Interview"
    ).length;

  const offerCount =
    applications.filter(
      (app) =>
        app.status === "Offer"
    ).length;

  const rejectedCount =
    applications.filter(
      (app) =>
        app.status === "Rejected"
    ).length;

    const StatCard = ({
  title,
  value,
  icon,
  iconColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
}) => (
  <div className="bg-white rounded-xl shadow-md hover:translate-y-1 transition p-6 border t-4 border-blue-500">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">
        {title}
      </h3>

      <div className={`text-xl ${iconColor}`}>
        {icon}
      </div>
    </div>

    <p className="text-5xl font-extrabold tracking-tight text-gray-800">
      {value}
    </p>
  </div>
);

  const filteredApplications =
  applications.filter(
    (application) => {
      const matchesSearch =
        application.companyName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        filterStatus === "All" ||
        application.status ===
          filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const getStatusBadgeColor = (
  status: string
) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800";

    case "Interview":
      return "bg-yellow-100 text-yellow-800";

    case "Offer":
      return "bg-green-100 text-green-800";

    case "Rejected":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};


  const fetchApplications =
    async () => {
      try {
        const response =
          await api.get(
            "/applications"
          );

        setApplications(
          response.data.applications
        );
      } catch (error) {
        console.error(error);
      }
    };

  const createApplication =
    async () => {
      if (
  !companyName.trim() ||
  !role.trim() ||
  !platform.trim() ||
  !jobLink.trim()
) {

 toast.error(
  "All fields are required"
);

  return;
}
      try {
        await api.post(
          "/applications",
          {
            companyName,
            role,
            status,
            platform,
            jobLink,
            applicationDate,
          }
        );
      toast.success(
          "Application created successfully"
          );
        setCompanyName("");
        setRole("");
        setStatus("Applied");
        setPlatform("")
        setJobLink("")

        fetchApplications();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteApplication =
    async (id: number) => {
      try {
        await api.delete(
          `/applications/${id}`
        );

        fetchApplications();
      } catch (error) {
        console.error(error);
      }
    };

  const openEditModal = (application: Application) => {
  setEditingApplicationId(application.id);

  setEditCompanyName(application.companyName);
  setEditRole(application.role);
  setEditPlatform(application.platform || "");
  setEditJobLink(application.jobLink || "");

  setEditApplicationDate(
    application.applicationDate.split("T")[0]
  );

  setEditStatus(application.status);

  setIsEditModalOpen(true);
};

const updateApplication = async () => {

  if(!editCompanyName.trim()){
    toast.error("Company Name is required")
    return;
  }

  if (!editRole.trim()) {
  toast.error("Role is required");
  return;
}

  if (
  editJobLink &&
  !/^https?:\/\/.+/.test(editJobLink)
) {
  toast.error(
    "Please enter a valid URL starting with http:// or https://"
  );
  return;
}
  setIsUpdating(true);
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/applications/${editingApplicationId}`,
      {
        companyName: editCompanyName,
        role: editRole,
        platform: editPlatform,
        jobLink: editJobLink,
        applicationDate: editApplicationDate,
        status: editStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   toast.success("Application updated successfully");

setEditingApplicationId(null);

setEditCompanyName("");
setEditRole("");
setEditPlatform("");
setEditJobLink("");
setEditApplicationDate("");
setEditStatus("Applied");

setIsEditModalOpen(false);

fetchApplications();
  } catch (error) {
    console.error("Update Error:", error);

if (axios.isAxiosError(error)) {
  console.log(error.response?.data);
}

    toast.error("Failed to update application");
  } finally {
    setIsUpdating(false);
  }
};

  const updateApplicationStatus =
    async (
      id: number,
      status: string
    ) => {
      try {
        await api.put(
          `/applications/${id}`,
          {
            status,
          }
        );

        fetchApplications();
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchApplications();
  }, []);

  useEffect(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditModalOpen(false);
    }
  };

  window.addEventListener("keydown", handleEscape);

  return () => {
    window.removeEventListener("keydown", handleEscape);
  };
}, []);

  return (
    
    <div className="min-h-screen bg-gray-100 p-10">
    <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
  Dashboard
</h1>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem(
              "token"
            );

            window.location.href =
              "/";
          }}
        >
          Logout
        </button>
      </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
  <StatCard
    title="Total Applications"
    value={totalApplications}
    icon={<FaBriefcase />}
    iconColor="text-blue-500"
  />

  <StatCard
    title="Applied"
    value={appliedCount}
    icon={<FaPaperPlane />}
    iconColor="text-indigo-500"
  />

  <StatCard
    title="Interview"
    value={interviewCount}
    icon={<FaUserTie />}
    iconColor="text-yellow-500"
  />

  <StatCard
    title="Offers"
    value={offerCount}
    icon={<FaCheckCircle />}
    iconColor="text-green-500"
  />

  <StatCard
    title="Rejected"
    value={rejectedCount}
    icon={<FaTimesCircle />}
    iconColor="text-red-500"
  />
</div>
      <div className="bg-white rounded-xl shadow-md p-10 mb-10">
        <h2 className="text-3xl font-bold mb-8">
          Create New Application
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Company Name
      </label>    
  <input
    type="text"
    placeholder="Enter Company Name"
    className="border rounded-lg px-4 py-2 w-64"
    value={companyName}
    onChange={(e) =>
      setCompanyName(e.target.value)
    }
  />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Role
      </label>  
  <input
    type="text"
    placeholder="Enter Role"
    className="border rounded-lg px-4 py-2 w-64"
    value={role}
    onChange={(e) =>
      setRole(e.target.value)
    }
  />
</div>

<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Platform
      </label>  
  <input
  type="text"
  placeholder="Enter Job Portal Name"
  className="border rounded-lg px-4 py-2 w-64"
  value={platform}
  onChange={(e) =>
    setPlatform(e.target.value)
  }
/>
</div>

<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Job Link
      </label>  

<input
  type="text"
  placeholder="Paste the link for the role"
  className="border rounded-lg px-4 py-2 w-64"
  value={jobLink}
  onChange={(e) =>
    setJobLink(e.target.value)
  }
/>
</div>

<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Appplication Date
      </label>  

  <input
  type="date"
  value={applicationDate}
  onChange={(e) =>
    setApplicationDate(
      e.target.value
    )
  }
  className="border rounded-lg px-4 py-2 w-64"
/>
</div>


<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Status
  </label>

  <select
    className="border rounded-lg px-4 py-2 w-50"
    value={status}
    onChange={(e) =>
      setStatus(e.target.value)
    }
  >
    <option>Applied</option>
    <option>Interview</option>
    <option>Offer</option>
    <option>Rejected</option>
  </select>
</div>

<div className="md:col-span-2 flex justify-center mt-6">
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-64 py-3 rounded-lg transition-all duration-200 hover:scale-105"
    onClick={createApplication}
  >
    Create Application
  </button>
</div>
</div>
      </div>

      <h2 className ="text-2xl font-bold mb-4">Applications</h2>
      <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Company"
        className ="border rounded-lg px-4 py-2 w-64"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

<select
  className="border rounded-lg px-4 py-2"
  value={filterStatus}
  onChange={(e) =>
    setFilterStatus(
      e.target.value
    )
  }
>
  <option>All</option>
  <option>Applied</option>
  <option>Interview</option>
  <option>Offer</option>
  <option>Rejected</option>
</select>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredApplications.map( (application) => (

          <div
            key={application.id}
            className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6"
          >
          <div className="flex justify-between items-center mb-3">
  <div>
    <h3 className="text-xl font-bold">
      {application.companyName}
    </h3>

    <p className="text-gray-600">
      {application.role}
    </p>
  </div>

  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
      application.status
    )}`}
  >
    {application.status}
  </span>
</div>



       

         <div className="flex items-center gap-2 text-gray-500 mb-2">
  <FaCalendarAlt />

  <span>
    {new Date(
      application.applicationDate
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}
  </span>
</div>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
  <FaGlobe />

  <span>
    {application.platform}
  </span>
</div>

          <a
  href={application.jobLink}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4"
>
  <FaExternalLinkAlt />

  <span>
    View Job Posting
  </span>
</a>    
          
          <div className="flex items-center justify-between border-t pt-4 mt-4">
  <div>
    <label className="mr-2 font-medium">
      Update Status:
    </label>

    <select
      className="border rounded-lg px-3 py-1"
      value={application.status}
      onChange={(e) =>
        updateApplicationStatus(
          application.id,
          e.target.value
        )
      }
    >
      <option>Applied</option>
      <option>Interview</option>
      <option>Offer</option>
      <option>Rejected</option>
    </select>
  </div>

 <div className="flex gap-3">

  <button
    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
    onClick={() =>
      openEditModal(application)
    }
  >
    <FaEdit />
    <span>Edit</span>
  </button>

  <button
    className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
    onClick={() =>
      deleteApplication(
        application.id
      )
    }
  >
    <FaTrash />
    <span>Delete</span>
  </button>

</div>
</div>    
          </div>
        )
      )}
    </div>

    {isEditModalOpen && (
    <div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={() => setIsEditModalOpen(false)}
>  

    <div
  className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl"
  onClick={(e) => e.stopPropagation()}
>

      <h2 className="text-2xl font-bold mb-6">
        Edit Application
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Company Name
          </label>

          <input
            type="text"
            value={editCompanyName}
            onChange={(e) =>
              setEditCompanyName(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Role
          </label>

          <input
            type="text"
            value={editRole}
            onChange={(e) =>
              setEditRole(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Platform
          </label>

          <input
            type="text"
            value={editPlatform}
            onChange={(e) =>
              setEditPlatform(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Link
          </label>

          <input
            type="text"
            value={editJobLink}
            onChange={(e) =>
              setEditJobLink(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Application Date
          </label>

          <input
            type="date"
            value={editApplicationDate}
            onChange={(e) =>
              setEditApplicationDate(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            value={editStatus}
            onChange={(e) =>
              setEditStatus(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-8">

        <button
          onClick={() =>
            setIsEditModalOpen(false)
          }
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </button>

       <button
  onClick={updateApplication}
  disabled={isUpdating}
  className={`px-6 py-2 rounded-lg text-white transition ${
    isUpdating
      ? "bg-blue-300 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {isUpdating ? "Saving..." : "Save Changes"}
</button>

      </div>

    </div>

  </div>
)}


    </div>
  );
}

export default Dashboard;