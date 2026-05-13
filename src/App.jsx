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

const STORAGE_KEY = "hale-ohana-celebration-tracker-v6";

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
  return (
    countTotalRequests(row) > 0 ||
    row.birthdayName ||
    row.anniversaryName ||
    row.retirementName ||
    row.honeymoonName ||
    row.babymoonName ||
    row.alohaName ||
    row.specialCelebName ||
    row.congratulationsName ||
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
      `${row.birthday} Happy Birthday${row.birthdayName ? ` (${row.birthdayName})` : ""}`
    );
  }

  if (row.anniversary > 0) {
    parts.push(
      `${row.anniversary} Happy Anniversary${row.anniversaryName ? ` (${row.anniversaryName})` : ""}`
    );
  }

  if (row.retirement > 0) {
    parts.push(
      `${row.retirement} Happy Retirement${row.retirementName ? ` (${row.retirementName})` : ""}`
    );
  }

  if (row.honeymoon > 0) {
    parts.push(
      `${row.honeymoon} Happy Honeymoon${row.honeymoonName ? ` (${row.honeymoonName})` : ""}`
    );
  }

  if (row.babymoon > 0) {
    parts.push(
      `${row.babymoon} Happy Babymoon${row.babymoonName ? ` (${row.babymoonName})` : ""}`
    );
  }

  if (row.aloha > 0) {
    parts.push(
      `${row.aloha} Aloha Ohana${row.alohaName ? ` (${row.alohaName})` : ""}`
    );
  }

  if (row.specialCeleb > 0) {
    parts.push(
      `${row.specialCeleb} Special Celeb${row.specialCelebName ? ` (${row.specialCelebName})` : ""}`
    );
  }

  if (row.congratulations > 0) {
    parts.push(
      `${row.congratulations} Congratulations${row.congratulationsName ? ` (${row.congratulationsName})` : ""}`
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

  return `${row.server} - ${countTotalRequests(row)} total request${
    countTotalRequests(row) !== 1 ? "s" : ""
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

      <label className="count-label">Large count</label>
      <select
        className="count-select"
        value={value}
        onChange={(e) => onCountChange(Number(e.target.value))}
      >
        {Array.from({ length: 21 }, (_, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>

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
  const [newServerName, setNewServerName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const upgraded = parsed.map((row, index) => ({
            ...createServerRow(row.server || defaultServers[index] || `Server ${index + 1}`),
            ...row,
          }));

          setServers(upgraded);
        }
      } catch (error) {
        console.log("Could not load saved data", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
  }, [servers]);

  const selected = servers[selectedIndex] || createServerRow("Server");

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

  function addServer() {
    const cleanName = newServerName.trim();

    if (!cleanName) return;

    const updated = [...servers, createServerRow(cleanName)];
    setServers(updated);
    setSelectedIndex(updated.length - 1);
    setNewServerName("");
  }

  function removeServer(index) {
    if (servers.length <= 1) return;

    const updated = servers.filter((_, i) => i !== index);
    setServers(updated);

    if (selectedIndex >= updated.length) {
      setSelectedIndex(updated.length - 1);
    }
  }

  const totals = servers.reduce(
    (acc, row) => {
      acc.birthdays += Number(row.birthday || 0);
      acc.anniversaries += Number(row.anniversary || 0);
      acc.retirements += Number(row.retirement || 0);
      acc.honeymoons += Number(row.honeymoon || 0);
      acc.babymoons += Number(row.babymoon || 0);
      acc.alohas += Number(row.aloha || 0);
      acc.specialCelebs += Number(row.specialCeleb || 0);
      acc.congratulations += Number(row.congratulations || 0);
      return acc;
    },
    {
      birthdays: 0,
      anniversaries: 0,
      retirements: 0,
      honeymoons: 0,
      babymoons: 0,
      alohas: 0,
      specialCelebs: 0,
      congratulations: 0,
    }
  );

  const grandTotal =
    totals.birthdays +
    totals.anniversaries +
    totals.retirements +
    totals.honeymoons +
    totals.babymoons +
    totals.alohas +
    totals.specialCelebs +
    totals.congratulations;

  return (
    <div className="app">
      <header className="topbar">
        <h1>Hale Ohana Celebration Tap Board</h1>
        <p>
          Quick celebration tracker for birthdays, anniversaries, retirement,
          honeymoon, babymoon, aloha ohana, congratulations, and special requests
        </p>
      </header>

      <section className="totals">
        <div className="total-card yellow">
          <h3>Happy Birthday</h3>
          <p>{totals.birthdays}</p>
        </div>

        <div className="total-card pink">
          <h3>Happy Anniversary</h3>
          <p>{totals.anniversaries}</p>
        </div>

        <div className="total-card purple">
          <h3>Happy Retirement</h3>
          <p>{totals.retirements}</p>
        </div>

        <div className="total-card peach">
          <h3>Happy Honeymoon</h3>
          <p>{totals.honeymoons}</p>
        </div>

        <div className="total-card peach">
          <h3>Happy Babymoon</h3>
          <p>{totals.babymoons}</p>
        </div>

        <div className="total-card blue">
          <h3>Aloha Ohana</h3>
          <p>{totals.alohas}</p>
        </div>

        <div className="total-card gray">
          <h3>Special Celeb</h3>
          <p>{totals.specialCelebs}</p>
        </div>

        <div className="total-card green">
          <h3>Congratulations</h3>
          <p>{totals.congratulations}</p>
        </div>

        <div className="total-card green">
          <h3>Grand Total</h3>
          <p>{grandTotal}</p>
        </div>
      </section>

      <main className="main-layout">
        <aside className="server-list">
          <h2>Servers / Areas</h2>

          <div className="add-server-box">
            <input
              type="text"
              placeholder="Add new server"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addServer();
              }}
            />

            <button className="reset-btn" onClick={addServer}>
              Add
            </button>
          </div>

          {servers.map((row, index) => {
            const status = getStatus(row);

            return (
              <div className="server-row" key={index}>
                <button
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

                  <small>
                    {countTotalRequests(row)} total request
                    {countTotalRequests(row) !== 1 ? "s" : ""}
                  </small>
                </button>

                <button
                  className="remove-server-btn"
                  onClick={() => removeServer(index)}
                  title="Remove server"
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
              namePlaceholder="Happy Birthday Ramon"
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
              title="Happy Babymoon"
              colorClass="peach"
              value={selected.babymoon}
              nameValue={selected.babymoonName}
              namePlaceholder="Garcia Family"
              onCountChange={(value) =>
                updateServer(selectedIndex, "babymoon", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "babymoonName", value)
              }
            />

            <CategoryBox
              title="Aloha Ohana"
              colorClass="blue"
              value={selected.aloha}
              nameValue={selected.alohaName}
              namePlaceholder="Sanchez Ohana"
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
              namePlaceholder="VIP, reunion, promotion, etc."
              onCountChange={(value) =>
                updateServer(selectedIndex, "specialCeleb", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "specialCelebName", value)
              }
            />

            <CategoryBox
              title="Congratulations"
              colorClass="green"
              value={selected.congratulations}
              nameValue={selected.congratulationsName}
              namePlaceholder="Graduation, engagement, achievement"
              onCountChange={(value) =>
                updateServer(selectedIndex, "congratulations", value)
              }
              onNameChange={(value) =>
                updateServer(selectedIndex, "congratulationsName", value)
              }
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