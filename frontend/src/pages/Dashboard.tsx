import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

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

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >
        <div className ="bg-white shadow-md rounded-lg p-6 min-w-[150px] text-center">
        
          <h3>Total</h3>
          <h2>
            {totalApplications}
          </h2>
        </div>

        <div className ="bg-white shadow-md rounded-lg p-6 min-w-[150px] text-center">
          
          <h3>Applied</h3>
          <h2>
            {appliedCount}
          </h2>
        </div>

        <div className ="bg-white shadow-md rounded-lg p-6 min-w-[150px] text-center">

          <h3>Interview</h3>
          <h2>
            {interviewCount}
          </h2>
        </div>

        <div className ="bg-white shadow-md rounded-lg p-6 min-w-[150px] text-center">

          <h3>Offer</h3>
          <h2>
            {offerCount}
          </h2>
        </div>

         <div className ="bg-white shadow-md rounded-lg p-6 min-w-[150px] text-center">

          <h3>Rejected</h3>
          <h2>
            {rejectedCount}
          </h2>
        </div>
      </div>

      <div className = "bg-white p-6 rounded-lg shadow-md mb-8">
        
        <h2 className="text-2xl font-bold mb-4">
          Create Application
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
  <input
    type="text"
    placeholder="Company Name"
    className="border rounded-lg px-4 py-2 w-64"
    value={companyName}
    onChange={(e) =>
      setCompanyName(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Role"
    className="border rounded-lg px-4 py-2 w-64"
    value={role}
    onChange={(e) =>
      setRole(e.target.value)
    }
  />

  <input
  type="text"
  placeholder="Platform"
  className="border rounded-lg px-4 py-2 w-64"
  value={platform}
  onChange={(e) =>
    setPlatform(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Job Link"
  className="border rounded-lg px-4 py-2 w-64"
  value={jobLink}
  onChange={(e) =>
    setJobLink(e.target.value)
  }
/>

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

  <select
    className="border rounded-lg px-4 py-2"
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

  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    onClick={createApplication}
  >
    Create Application
  </button>
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



      {filteredApplications.map(
        (application) => (

          <div
            key={application.id}
            className="bg-white shadow-md rounded-lg p-5 mb-4"
          >
            <h3 className="text-xl font-bold">
              {
                application.companyName
              }
            </h3>

            <p className="text-gray-600 mb-4">
              {
                application.role
              }
            </p>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusBadgeColor(
              application.status
                       )}`}
            >
  {application.status}
</span>

            <p className="text-gray-500 mb-2">
                Applied:{" "}
                {new Date(
                      application.applicationDate
                    ).toLocaleDateString(
                "en-GB",
                {
                 day: "numeric",
                month: "short",
                year: "numeric",
               }
  )}
</p>

             <p className="text-gray-600">
              Platform: {application.platform}
            </p>

              <a
                href={application.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Job Posting
            </a> 
          
          <div className="flex items-center justify-between mt-4">
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

  <button
    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
    onClick={() =>
      deleteApplication(
        application.id
      )
    }
  >
    Delete
  </button>
</div>    
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;