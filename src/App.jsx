import { useEffect, useState } from "react";
import "./App.css";

const defaultServers = [
  "Andrei",
  "Alyssa",
  "Benj",
  "Christine",
  "James",
  "Toffee",
  "Server 7",
  "Server 8",
  "Server 9",
  "Server 10",
  "Server 11",
  "Server 12",
];

const STORAGE_KEY = "hale-ohana-celebration-tracker-v5";

function createServerRow(name) {
  return {
    server: name,

    birthday: 0,
    birthdayName: "",

    anniversary: 0,
    anniversaryName: "",

    retirement: 0,
    retirementName: "",

    honeymoon: 0,
    honeymoonName: "",

    babymoon: 0,
    babymoonName: "",

    aloha: 0,
    alohaName: "",

    specialCeleb: 0,
    specialCelebName: "",

    congratulations: 0,
    congratulationsName: "",

    lateRequest: false,
    lateRequestText: "",

    completed: false,
    notes: "",
  };
}

function countTotalRequests(row) {
  return (
    Number(row.birthday || 0) +
    Number(row.anniversary || 0) +
    Number(row.retirement || 0) +
    Number(row.honeymoon || 0) +
    Number(row.babymoon || 0) +
    Number(row.aloha || 0) +
    Number(row.specialCeleb || 0) +
    Number(row.congratulations || 0)
  );
}

function hasAnyInput(row) {
  return countTotalRequests(row) > 0;
}

function getStatus(row) {
  if (row.completed) return "done";
  if (row.lateRequest) return "late";
  if (hasAnyInput(row)) return "progress";
  return "waiting";
}

function buildSummaryParts(row) {
  const parts = [];

  if (row.birthday > 0)
    parts.push(
      `${row.birthday} Happy Birthday ${
        row.birthdayName || ""
      }`
    );

  if (row.anniversary > 0)
    parts.push(
      `${row.anniversary} Happy Anniversary ${
        row.anniversaryName || ""
      }`
    );

  if (row.retirement > 0)
    parts.push(
      `${row.retirement} Happy Retirement ${
        row.retirementName || ""
      }`
    );

  if (row.honeymoon > 0)
    parts.push(
      `${row.honeymoon} Happy Honeymoon ${
        row.honeymoonName || ""
      }`
    );

  if (row.babymoon > 0)
    parts.push(
      `${row.babymoon} Happy Babymoon ${
        row.babymoonName || ""
      }`
    );

  if (row.aloha > 0)
    parts.push(
      `${row.aloha} Aloha Ohana ${
        row.alohaName || ""
      }`
    );

  if (row.specialCeleb > 0)
    parts.push(
      `${row.specialCeleb} Special Celeb ${
        row.specialCelebName || ""
      }`
    );

  if (row.congratulations > 0)
    parts.push(
      `${row.congratulations} Congratulations ${
        row.congratulationsName || ""
      }`
    );

  return parts.length > 0
    ? `${row.server}: ${parts.join(", ")}`
    : `${row.server}: No requests`;
}

function CategoryBox({
  title,
  colorClass,
  value,
  nameValue,
  namePlaceholder,
  onCountChange,
  onNameChange,
}) {
  return (
    <div className={`box ${colorClass}`}>
      <h3>{title}</h3>

      <div className="tap-buttons">
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className={
              value === num
                ? "tap active-tap"
                : "tap"
            }
            onClick={() => onCountChange(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder={namePlaceholder}
        value={nameValue}
        onChange={(e) =>
          onNameChange(e.target.value)
        }
      />
    </div>
  );
}

export default function App() {
  const [servers, setServers] = useState(
    defaultServers.map(createServerRow)
  );

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [newServerName, setNewServerName] =
    useState("");

  useEffect(() => {
    const saved = localStorage.getItem(
      STORAGE_KEY
    );

    if (saved) {
      try {
        setServers(JSON.parse(saved));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(servers)
    );
  }, [servers]);

  const selected = servers[selectedIndex];

  function updateServer(index, field, value) {
    const updated = [...servers];
    updated[index][field] = value;

    if (field !== "completed") {
      updated[index].completed = false;
    }

    setServers(updated);
  }

  function resetRow(index) {
    const oldName = servers[index].server;

    const updated = [...servers];

    updated[index] =
      createServerRow(oldName);

    setServers(updated);
  }

  function addServer() {
    if (!newServerName.trim()) return;

    const updated = [
      ...servers,
      createServerRow(newServerName),
    ];

    setServers(updated);

    setNewServerName("");
  }

  function removeServer(index) {
    const updated = servers.filter(
      (_, i) => i !== index
    );

    setServers(updated);

    if (selectedIndex >= updated.length) {
      setSelectedIndex(updated.length - 1);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>
          Hale Ohana Celebration Tap Board
        </h1>

        <p>
          Tablet friendly celebration tracker
        </p>
      </header>

      <main className="main-layout">
        <aside className="server-list">
          <h2>Servers / Areas</h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              placeholder="Add new server"
              value={newServerName}
              onChange={(e) =>
                setNewServerName(
                  e.target.value
                )
              }
            />

            <button
              className="reset-btn"
              onClick={addServer}
            >
              Add
            </button>
          </div>

          {servers.map((row, index) => {
            const status = getStatus(row);

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                <button
                  className={
                    selectedIndex === index
                      ? "server-btn active"
                      : "server-btn"
                  }
                  onClick={() =>
                    setSelectedIndex(index)
                  }
                >
                  <div className="server-btn-top">
                    <span>{row.server}</span>

                    <span
                      className={`status-pill ${status}`}
                    >
                      {status}
                    </span>
                  </div>

                  <small>
                    {countTotalRequests(row)}{" "}
                    requests
                  </small>
                </button>

                <button
                  className="reset-btn danger"
                  onClick={() =>
                    removeServer(index)
                  }
                >
                  X
                </button>
              </div>
            );
          })}
        </aside>

        <section className="editor">
          <div className="editor-header">
            <div>
              <h2>{selected.server}</h2>

              <p className="subtext">
                Yellow = in progress |
                Orange = late | Green =
                done
              </p>
            </div>

            <button
              className="reset-btn"
              onClick={() =>
                resetRow(selectedIndex)
              }
            >
              Reset Row
            </button>
          </div>

          <div className="grid">
            <CategoryBox
              title="Happy Birthday"
              colorClass="yellow"
              value={selected.birthday}
              nameValue={selected.birthdayName}
              namePlaceholder="Ramon"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "birthday",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "birthdayName",
                  value
                )
              }
            />

            <CategoryBox
              title="Happy Anniversary"
              colorClass="pink"
              value={selected.anniversary}
              nameValue={
                selected.anniversaryName
              }
              namePlaceholder="Lee Couple"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "anniversary",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "anniversaryName",
                  value
                )
              }
            />

            <CategoryBox
              title="Happy Retirement"
              colorClass="purple"
              value={selected.retirement}
              nameValue={
                selected.retirementName
              }
              namePlaceholder="Mr. Santos"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "retirement",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "retirementName",
                  value
                )
              }
            />

            <CategoryBox
              title="Happy Honeymoon"
              colorClass="peach"
              value={selected.honeymoon}
              nameValue={
                selected.honeymoonName
              }
              namePlaceholder="Smith Couple"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "honeymoon",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "honeymoonName",
                  value
                )
              }
            />

            <CategoryBox
              title="Happy Babymoon"
              colorClass="peach"
              value={selected.babymoon}
              nameValue={
                selected.babymoonName
              }
              namePlaceholder="Garcia Family"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "babymoon",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "babymoonName",
                  value
                )
              }
            />

            <CategoryBox
              title="Aloha Ohana"
              colorClass="blue"
              value={selected.aloha}
              nameValue={selected.alohaName}
              namePlaceholder="Sanchez Family"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "aloha",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "alohaName",
                  value
                )
              }
            />

            <CategoryBox
              title="Special Celeb"
              colorClass="gray"
              value={selected.specialCeleb}
              nameValue={
                selected.specialCelebName
              }
              namePlaceholder="VIP, reunion"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "specialCeleb",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "specialCelebName",
                  value
                )
              }
            />

            <CategoryBox
              title="Congratulations"
              colorClass="green"
              value={
                selected.congratulations
              }
              nameValue={
                selected.congratulationsName
              }
              namePlaceholder="Graduation"
              onCountChange={(value) =>
                updateServer(
                  selectedIndex,
                  "congratulations",
                  value
                )
              }
              onNameChange={(value) =>
                updateServer(
                  selectedIndex,
                  "congratulationsName",
                  value
                )
              }
            />
          </div>

          <div
            className={`summary-box ${getStatus(
              selected
            )}`}
          >
            <h3>Live Summary</h3>

            <p>{buildSummaryParts(selected)}</p>
          </div>
        </section>
      </main>
    </div>
  );
}