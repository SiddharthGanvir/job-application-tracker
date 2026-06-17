import { useEffect, useState } from "react";

import api from "../services/api";

function Dashboard() {
  const [applications, setApplications] =
    useState<any[]>([]);

  const [companyName, setCompanyName] =
    useState("");

  const [role, setRole] =
    useState("");

  const [status, setStatus] =
    useState("Applied");

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
      try {
        await api.post(
          "/applications",
          {
            companyName,
            role,
            status,
          }
        );

        setCompanyName("");
        setRole("");
        setStatus("Applied");

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
    fetchApplications();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>Create Application</h2>

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        />

        <br />
        <br />

        <select
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

        <br />
        <br />

        <button
          onClick={createApplication}
        >
          Create Application
        </button>
      </div>

      <h2>Applications</h2>

      {applications.map(
        (application) => (
          <div
            key={application.id}
            style={{
              border:
                "1px solid black",
              padding: "10px",
              marginBottom:
                "10px",
            }}
          >
            <h3>
              {
                application.companyName
              }
            </h3>

            <p>
              Role:
              {
                application.role
              }
            </p>

            <div>
              <label>
                Status:
              </label>

              <select
                value={
                  application.status
                }
                onChange={(e) =>
                  updateApplicationStatus(
                    application.id,
                    e.target.value
                  )
                }
              >
                <option>
                  Applied
                </option>

                <option>
                  Interview
                </option>

                <option>
                  Offer
                </option>

                <option>
                  Rejected
                </option>
              </select>
            </div>

            <br />

            <button
              onClick={() =>
                deleteApplication(
                  application.id
                )
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;