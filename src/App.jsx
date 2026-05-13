import { useEffect, useState } from "react";
import "./App.css";

const defaultServers = [
  "Andrei",
  "Angela",
  "Benj",
  "Christine",
  "James",
  "Server 9",
  "Server 10",
  "Server 11",
  "Server 12",
  "Server 13",
  "Server 14",
  "Server 15",
];

const STORAGE_KEY = "hale-ohana-celebration-tracker-v2";

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

    aloha: 0,
    alohaName: "",

    specialCeleb: 0,
    specialCelebName: "",

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
    Number(row.aloha || 0) +
    Number(row.specialCeleb || 0)
  );
}

function hasAnyInput(row) {
  return (
    countTotalRequests(row) > 0 ||
    row.birthdayName ||
    row.anniversaryName ||
    row.retirementName ||
    row.honeymoonName ||
    row.alohaName ||
    row.specialCelebName ||
    row.lateRequestText ||
    row.notes
  );
}

function getStatus(row) {
  if (row.completed) return "done";
  if (row.lateRequest) return "late";
  if (hasAnyInput(row)) return "progress";
  return "waiting";
}

function buildSummaryParts(row) {
  const parts = [];

  if (row.birthday > 0) {
    parts.push(
      `${row.birthday} ${row.birthday === 1 ? "Birthday" : "Birthdays"}${row.birthdayName ? ` (${row.birthdayName})` : ""
      }`
    );
  }

  if (row.anniversary > 0) {
    parts.push(
      `${row.anniversary} ${row.anniversary === 1 ? "Anniversary" : "Anniversaries"
      }${row.anniversaryName ? ` (${row.anniversaryName})` : ""}`
    );
  }

  if (row.retirement > 0) {
    parts.push(
      `${row.retirement} ${row.retirement === 1 ? "Retirement" : "Retirements"}${row.retirementName ? ` (${row.retirementName})` : ""
      }`
    );
  }

  if (row.honeymoon > 0) {
    parts.push(
      `${row.honeymoon} ${row.honeymoon === 1 ? "Honeymoon" : "Honeymoons"}${row.honeymoonName ? ` (${row.honeymoonName})` : ""
      }`
    );
  }

  if (row.aloha > 0) {
    parts.push(
      `${row.aloha} Aloha${row.aloha > 1 ? "s" : ""}${row.alohaName ? ` (${row.alohaName})` : ""
      }`
    );
  }

  if (row.specialCeleb > 0) {
    parts.push(
      `${row.specialCeleb} ${row.specialCeleb === 1 ? "Special Celeb" : "Special Celebs"
      }${row.specialCelebName ? ` (${row.specialCelebName})` : ""}`
    );
  }

  if (row.lateRequest && row.lateRequestText) {
    parts.push(`Late Request (${row.lateRequestText})`);
  } else if (row.lateRequest) {
    parts.push("Late Request");
  }

  if (parts.length === 0) {
    return `${row.server} - No requests yet`;
  }

  return `${row.server} - ${countTotalRequests(row)} total request${countTotalRequests(row) !== 1 ? "s" : ""
    }: ${parts.join(", ")}`;
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
            className={value === num ? "tap active-tap" : "tap"}
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
        onChange={(e) => onNameChange(e.target.value)}
      />
    </div>
  );
}

export default function App() {
  const [servers, setServers] = useState(defaultServers.map(createServerRow));
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServers(parsed);
        }
      } catch (error) {
        console.log("Could not load saved data", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
  }, [servers]);

  const selected = servers[selectedIndex];

  function updateServer(index, field, value) {
    const updated = [...servers];
    updated[index][field] = value;

    if (field !== "completed" && updated[index].completed) {
      updated[index].completed = false;
    }

    setServers(updated);
  }

  function resetRow(index) {
    const oldName = servers[index].server;
    const updated = [...servers];
    updated[index] = createServerRow(oldName);
    setServers(updated);
  }

  function resetAll() {
    const updated = servers.map((row) => createServerRow(row.server));
    setServers(updated);
  }

  const totals = servers.reduce(
    (acc, row) => {
      acc.birthdays += Number(row.birthday);
      acc.anniversaries += Number(row.anniversary);
      acc.retirements += Number(row.retirement);
      acc.honeymoons += Number(row.honeymoon);
      acc.alohas += Number(row.aloha);
      acc.specialCelebs += Number(row.specialCeleb);
      return acc;
    },
    {
      birthdays: 0,
      anniversaries: 0,
      retirements: 0,
      honeymoons: 0,
      alohas: 0,
      specialCelebs: 0,
    }
  );

  const grandTotal =
    totals.birthdays +
    totals.anniversaries +
    totals.retirements +
    totals.honeymoons +
    totals.alohas +
    totals.specialCelebs;

  return (
    <div className="app">
      <header className="topbar">
        <h1>Hale Ohana Celebration Tap Board</h1>
        <p>Quick celebration tracker for birthdays, anniversaries, retirement, honeymoon, aloha, and special requests</p>
      </header>

      <section className="totals">
        <div className="total-card yellow">
          <h3>Birthdays</h3>
          <p>{totals.birthdays}</p>
        </div>

        <div className="total-card pink">
          <h3>Anniversaries</h3>
          <p>{totals.anniversaries}</p>
        </div>

        <div className="total-card purple">
          <h3>Retirement</h3>
          <p>{totals.retirements}</p>
        </div>

        <div className="total-card peach">
          <h3>Honeymoon</h3>
          <p>{totals.honeymoons}</p>
        </div>

        <div className="total-card blue">
          <h3>Aloha</h3>
          <p>{totals.alohas}</p>
        </div>

        <div className="total-card gray">
          <h3>Special Celeb</h3>
          <p>{totals.specialCelebs}</p>
        </div>

        <div className="total-card green">
          <h3>Grand Total</h3>
          <p>{grandTotal}</p>
        </div>
      </section>

      <main className="main-layout">
        <aside className="server-list">
          <h2>Servers / Areas</h2>

          {servers.map((row, index) => {
            const status = getStatus(row);

            return (
              <button
                key={index}
                className={selectedIndex === index ? "server-btn active" : "server-btn"}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="server-btn-top">
                  <span>{row.server}</span>
                  <span className={`status-pill ${status}`}>
                    {status === "waiting" && "Waiting"}
                    {status === "progress" && "In Progress"}
                    {status === "late" && "Late Request"}
                    {status === "done" && "Done"}
                  </span>
                </div>

                <small>{countTotalRequests(row)} total request{countTotalRequests(row) !== 1 ? "s" : ""}</small>
              </button>
            );
          })}
        </aside>

        <section className="editor">
          <div className="editor-header">
            <div>
              <h2>{selected.server}</h2>
              <p className="subtext">
                Yellow means in progress. Orange means late request. Green means done.
              </p>
            </div>

            <button className="reset-btn" onClick={() => resetRow(selectedIndex)}>
              Reset This Row
            </button>
          </div>

          <div className="status-actions">
            <label className="checkbox-card late-card">
              <input
                type="checkbox"
                checked={selected.lateRequest}
                onChange={(e) =>
                  updateServer(selectedIndex, "lateRequest", e.target.checked)
                }
              />
              <span>Late Guest / Late Request</span>
            </label>

            <label className="checkbox-card done-card">
              <input
                type="checkbox"
                checked={selected.completed}
                onChange={(e) =>
                  updateServer(selectedIndex, "completed", e.target.checked)
                }
              />
              <span>Writer Finished / Request Completed</span>
            </label>
          </div>

          <div className="late-request-box">
            <h3>Late Request Details</h3>
            <input
              type="text"
              placeholder="Example: Guest arrived late, added honeymoon, table 16"
              value={selected.lateRequestText}
              onChange={(e) =>
                updateServer(selectedIndex, "lateRequestText", e.target.value)
              }
            />
          </div>

          <div className="grid">
            <CategoryBox
              title="Happy Birthday"
              colorClass="yellow"
              value={selected.birthday}
              nameValue={selected.birthdayName}
              namePlaceholder="Ramon or Happy Birthday Ramon"
              onCountChange={(value) =>
                updateServer(selectedIndex, "birthday", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "birthdayName", value)
              }
            />

            <CategoryBox
              title="Happy Anniversary"
              colorClass="pink"
              value={selected.anniversary}
              nameValue={selected.anniversaryName}
              namePlaceholder="Lee Couple"
              onCountChange={(value) =>
                updateServer(selectedIndex, "anniversary", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "anniversaryName", value)
              }
            />

            <CategoryBox
              title="Happy Retirement"
              colorClass="purple"
              value={selected.retirement}
              nameValue={selected.retirementName}
              namePlaceholder="Mr. Santos"
              onCountChange={(value) =>
                updateServer(selectedIndex, "retirement", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "retirementName", value)
              }
            />

            <CategoryBox
              title="Happy Honeymoon"
              colorClass="peach"
              value={selected.honeymoon}
              nameValue={selected.honeymoonName}
              namePlaceholder="Smith Couple"
              onCountChange={(value) =>
                updateServer(selectedIndex, "honeymoon", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "honeymoonName", value)
              }
            />

            <CategoryBox
              title="Aloha Ohana"
              colorClass="blue"
              value={selected.aloha}
              nameValue={selected.alohaName}
              namePlaceholder="Sanchez Family"
              onCountChange={(value) =>
                updateServer(selectedIndex, "aloha", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "alohaName", value)
              }
            />

            <CategoryBox
              title="Special Celeb"
              colorClass="gray"
              value={selected.specialCeleb}
              nameValue={selected.specialCelebName}
              namePlaceholder="Graduation, reunion, promotion, etc."
              onCountChange={(value) =>
                updateServer(selectedIndex, "specialCeleb", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "specialCelebName", value)
              }

            />
            <CategoryBox
              title="Congratulations"
              color="#d4f4dd"
              value={selectedServerData.congratulations}
              onChange={(val) =>
                updateServerData(selectedServer, "congratulations", val)
              }
              names={selectedServerData.congratulationsNames}
              onNamesChange={(val) =>
                updateServerData(selectedServer, "congratulationsNames", val)
              }
              namePlaceholder="Promotion, graduation, engagement, etc."
            />
          </div>

          <div className="notes-box">
            <h3>Notes</h3>
            <input
              type="text"
              placeholder="VIP, table number, extra instruction, special timing"
              value={selected.notes}
              onChange={(e) => updateServer(selectedIndex, "notes", e.target.value)}
            />
          </div>

          <div className={`summary-box ${getStatus(selected)}`}>
            <h3>Live Summary</h3>
            <p>{buildSummaryParts(selected)}</p>
            {selected.notes && <small>Notes: {selected.notes}</small>}
          </div>
        </section>
      </main>

      <section className="summary-board">
        <div className="summary-header">
          <h2>All Server Summaries</h2>
          <button className="reset-btn danger" onClick={resetAll}>
            Reset All
          </button>
        </div>

        <div className="summary-grid">
          {servers.map((row, index) => (
            <div key={index} className="summary-card">
              <div className="summary-card-top">
                <h3>{row.server}</h3>
                <span className={`status-pill ${getStatus(row)}`}>
                  {getStatus(row) === "waiting" && "Waiting"}
                  {getStatus(row) === "progress" && "In Progress"}
                  {getStatus(row) === "late" && "Late Request"}
                  {getStatus(row) === "done" && "Done"}
                </span>
              </div>

              <p>{buildSummaryParts(row)}</p>

              {row.notes && <small>Notes: {row.notes}</small>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}