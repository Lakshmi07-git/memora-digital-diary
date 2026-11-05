
import { useState } from "react";
import Auth from "./Auth";
import "./App.css";


function MoodIcon({ name, size = 38 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const icons = {
    Happy: (
      <>
        <circle cx="24" cy="24" r="17" />
        <path d="M17 27c2 7 12 7 14 0" />
        <path d="M17 19h.1M31 19h.1" />
      </>
    ),
    Loved: (
      <path d="M24 39S5 27 8 16c2-9 13-10 16-2 4-8 15-7 17 2 3 11-17 23-17 23Z" />
    ),
    Sad: (
      <>
        <path d="M24 5C19 14 11 22 11 29a13 13 0 0 0 26 0c0-7-8-15-13-24Z" />
        <path d="M19 31c1 3 3 4 6 4" />
      </>
    ),
    Angry: (
      <>
        <circle cx="24" cy="24" r="17" />
        <path d="m15 18 8 3m10-3-8 3M17 33c3-5 11-5 14 0" />
      </>
    ),
    Tired: (
      <>
        <path d="M11 29a16 16 0 1 0 19-22 13 13 0 0 1-19 22Z" />
        <path d="M20 19l-3 3m3-3 3 3m7-3-3 3m3-3 3 3" />
      </>
    ),
    Excited: (
      <path d="m24 4 5.5 13.5L43 23l-13.5 5.5L24 42l-5.5-13.5L5 23l13.5-5.5L24 4Z" />
    ),
    Calm: (
      <>
        <path d="M39 8C21 8 10 16 10 29c0 7 5 11 11 11C34 40 40 25 39 8Z" />
        <path d="M10 40c7-10 14-16 24-23" />
      </>
    ),
    Anxious: (
      <path d="M10 16c5-8 9 8 14 0s9 8 14 0M10 25c5-8 9 8 14 0s9 8 14 0M10 34c5-8 9 8 14 0s9 8 14 0" />
    )
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function App() {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userName, setUserName] = useState("");
  const [page, setPage] = useState("home");

  const [diary, setDiary] = useState("");
  const [memories, setMemories] = useState([]);
  const [mood, setMood] = useState("😊");
  const [memoryDate, setMemoryDate] = useState(today);
  const [calendarDate, setCalendarDate] = useState(today);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState(today);
  const [editMood, setEditMood] = useState("😊");
  const [editImage, setEditImage] = useState("");

 const moods = [
  {
    emoji: "😊",
    name: "Happy",
    color: "#fff0c9",
    message: "Keep smiling! Your happiness makes ordinary moments beautiful. 💛"
  },
  {
    emoji: "🥰",
    name: "Loved",
    color: "#ffe1ed",
    message: "You deserve love, kindness, and all the little things that make you feel special. 💗"
  },
  {
    emoji: "🥺",
    name: "Sad",
    color: "#e2eaff",
    message: "It's okay not to be okay. Take a deep breath. You don't have to figure everything out today. 🌷"
  },
  {
    emoji: "😡",
    name: "Angry",
    color: "#ffe1df",
    message: "Pause, breathe, and give yourself some space. Your feelings matter, but you deserve peace too. ❤️"
  },
  {
    emoji: "😴",
    name: "Tired",
    color: "#e9e1ff",
    message: "Rest is productive too. Take a break and remember that you don't have to do everything at once. 🌙"
  },
  {
    emoji: "😍",
    name: "Excited",
    color: "#ffe8d6",
    message: "Enjoy this beautiful energy! Let yourself celebrate the little things. ✨"
  },
  {
    emoji: "😌",
    name: "Calm",
    color: "#e2f3e9",
    message: "Enjoy this peaceful moment. You deserve time to breathe and feel at ease. 🌿"
  },
 {
  name: "Anxious",
  emoji: "😟",
  color: "#e8d8f5",
  message: "Take a deep breath. You are safe."
}
];
  const selectedMood = moods.find((item) => item.emoji === mood) || moods[0];

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleImageUpload = (file, setter) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessageType("error");
      setMessage("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const uploadedImage = new Image();

      uploadedImage.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1000;
        const scale = Math.min(1, maxWidth / uploadedImage.width);

        canvas.width = uploadedImage.width * scale;
        canvas.height = uploadedImage.height * scale;

        const context = canvas.getContext("2d");
        context.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

        setter(canvas.toDataURL("image/jpeg", 0.7));
        setMessage("");
      };

      uploadedImage.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  // Load memories after login
  const handleLogin = async (name) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://memora-digital-diary.onrender.com/api/memories", {
  headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Could not load memories");
      }

      const data = await response.json();

      setMemories(
        data.map((memory) => ({
          ...memory,
          id: memory._id
        }))
      );

      setMessage("");
      setPage("home");
    } catch (error) {
      setMemories([]);
      setMessageType("error");
      setMessage("Could not load your memories. Please try again.");
      setPage("memories");
    }

    setUserName(name);
    setShowAuth(false);
    setShowDashboard(true);
  };

  // Save a new diary memory
  const saveDiary = async () => {
    if (!diary.trim()) {
      setMessageType("error");
      setMessage("Please write something before saving.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: diary,
          date: memoryDate,
          mood,
          image
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save memory");
      }

      setMemories((previous) => [
        { ...data.memory, id: data.memory._id },
        ...previous
      ]);

      setDiary("");
      setImage("");
      setMessageType("success");
      setMessage("Your memory has been saved! 💖");
      setPage("memories");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Save today's mood
  const saveMood = async () => {
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: `Mood check-in: ${selectedMood.name}`,
          date: today,
          mood,
          image: ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save mood");
      }

      setMemories((previous) => [
        { ...data.memory, id: data.memory._id },
        ...previous
      ]);

      setMessageType("success");
      setMessage("Today's mood has been saved! 💗");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not save mood.");
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const startEdit = (memory) => {
    setEditingId(memory.id);
    setEditText(memory.text);
    setEditDate(memory.date);
    setEditMood(memory.mood || "😊");
    setEditImage(memory.image || "");
    setMessage("");
  };

  // Save edited memory
  const saveEdit = async (id) => {
    if (!editText.trim() || !editDate) {
      setMessageType("error");
      setMessage("Please enter diary text and date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/memories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            text: editText,
            date: editDate,
            mood: editMood,
            image: editImage
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update memory");
      }

      setMemories((previous) =>
        previous.map((memory) =>
          memory.id === id
            ? { ...data.memory, id: data.memory._id }
            : memory
        )
      );

      setEditingId(null);
      setMessageType("success");
      setMessage("Memory updated successfully! 💖");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not update memory.");
    }
  };

  // Add or remove favourite
  const toggleFavorite = async (memory) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/memories/${memory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            isFavorite: !memory.isFavorite
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update favourite");
      }

      setMemories((previous) =>
        previous.map((item) =>
          item.id === memory.id
            ? { ...data.memory, id: data.memory._id }
            : item
        )
      );
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not update favourite.");
    }
  };

  // Delete memory
  const deleteMemory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this memory?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/memories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete memory");
      }

      setMemories((previous) =>
        previous.filter((memory) => memory.id !== id)
      );

      setMessageType("success");
      setMessage("Memory deleted successfully! 💖");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not delete memory.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMemories([]);
    setShowDashboard(false);
    setShowAuth(false);
    setPage("home");
    setUserName("");
    setMessage("");
    setEditingId(null);
  };

  // Dashboard data
  const diaryMemories = memories.filter(
    (memory) => !memory.text?.startsWith("Mood check-in:")
  );

  const favoriteMemories = diaryMemories.filter(
    (memory) => memory.isFavorite
  );

  const moodHistory = memories.filter(
    (memory) => memory.text?.startsWith("Mood check-in:")
  );

  const selectedMemories = diaryMemories.filter(
    (memory) => memory.date === calendarDate
  );

  const pageTitles = {
    home: "Your Memory Space",
    diary: "Write Your Diary",
    memories: "My Memories",
    mood: "Mood Garden",
    calendar: "Memory Calendar",
    favorites: "Favourite Moments",
    history: "Mood History",
    journey: "My Journey"
  };

  const changePage = (nextPage) => {
    setMessage("");
    setEditingId(null);
    setPage(nextPage);
  };

  // Reusable scrapbook-style memory card
  const renderMemory = (memory) => (
    <div className="memory-item scrapbook-card" key={memory.id}>
      {editingId === memory.id ? (
        <div className="edit-memory-form">
          <h3>Edit Your Memory ✏️</h3>

          <label>Date:</label>
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
          />

          <label>Mood:</label>
          <div className="mood-grid">
            {moods.map((item) => (
              <button
                type="button"
                key={item.name}
                className={`mood-card ${editMood === item.emoji ? "selected" : ""}`}
                style={{ backgroundColor: item.color }}
                onClick={() => setEditMood(item.emoji)}
              >
               <span className="mood-icon">
  <MoodIcon name={item.name} />
</span>
                <p>{item.name}</p>
              </button>
            ))}
          </div>

          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Edit your memory..."
          />

          <label>Add or change photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e.target.files[0], setEditImage)
            }
          />

          {editImage && (
            <div className="photo-preview">
              <img src={editImage} alt="Memory preview" />
              <button type="button" onClick={() => setEditImage("")}>
                Remove photo
              </button>
            </div>
          )}

          <div className="memory-actions">
            <button
              className="edit-memory-btn"
              onClick={() => saveEdit(memory.id)}
            >
              Save Changes
            </button>

            <button
              className="delete-memory-btn"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="scrapbook-top">
            <span className="scrapbook-date">
              {formatDate(memory.date)}
            </span>

            <button
              className={`favorite-btn ${memory.isFavorite ? "favorited" : ""}`}
              onClick={() => toggleFavorite(memory)}
              title="Add to favourites"
            >
              {memory.isFavorite ? "♥" : "♡"}
            </button>
          </div>

          <div className="scrapbook-decoration">
            <span>✿</span>
            <small>A LITTLE MEMORY</small>
            <span>✿</span>
          </div>

          <p className="scrapbook-story">{memory.text}</p>

          {memory.image && (
            <img
              className="memory-photo scrapbook-photo"
              src={memory.image}
              alt="Saved memory"
            />
          )}

          <div className="scrapbook-bottom">
            <span>Made of little moments ♡</span>

            <div className="memory-actions">
              <button
                className="edit-memory-btn"
                onClick={() => startEdit(memory)}
              >
                ✎ Edit
              </button>

              <button
                className="delete-memory-btn"
                onClick={() => deleteMemory(memory.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (showAuth && !showDashboard) {
    return <Auth onLogin={handleLogin} />;
  }

  if (showDashboard) {
    return (
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-logo">✦ Memora</div>

          <p className="sidebar-label">MENU</p>

          <button
            className={page === "home" ? "side-link active" : "side-link"}
            onClick={() => changePage("home")}
          >
            <span>⌂</span> Home
          </button>

          <button
            className={page === "diary" ? "side-link active" : "side-link"}
            onClick={() => changePage("diary")}
          >
            <span>✎</span> Write Diary
          </button>

          <button
            className={page === "memories" ? "side-link active" : "side-link"}
            onClick={() => changePage("memories")}
          >
            <span>♡</span> My Memories
          </button>

          <button
            className={page === "favorites" ? "side-link active" : "side-link"}
            onClick={() => changePage("favorites")}
          >
            <span>♥</span> Favourites
          </button>

          <button
            className="sidebar-label journey-heading"
            onClick={() => changePage("journey")}
          >
            YOUR JOURNEY ↓
          </button>

          <button
            className={page === "journey" ? "side-link active" : "side-link"}
            onClick={() => changePage("journey")}
          >
            <span>🌷</span> My Journey
          </button>

          <button
            className={page === "mood" ? "side-link active" : "side-link"}
            onClick={() => changePage("mood")}
          >
            <span>☀</span> Mood Tracker
          </button>

          <button
            className={page === "history" ? "side-link active" : "side-link"}
            onClick={() => changePage("history")}
          >
            <span>♡</span> Mood History
          </button>

          <button
            className={page === "calendar" ? "side-link active" : "side-link"}
            onClick={() => changePage("calendar")}
          >
            <span>▦</span> Calendar
          </button>

          <div className="sidebar-bottom">
            <div className="sidebar-user">
              <span>🌷</span>
              <div>
                <strong>{userName}</strong>
                <small>My personal space</small>
              </div>
            </div>

            <button className="logout-btn" onClick={logout}>
              ↪ Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="header-date">{formatDate(today)}</span>
              <h2>{pageTitles[page]}</h2>
            </div>
            <div className="header-avatar">🌸</div>
          </header>

          {message && (
            <div className={`save-success ${messageType === "error" ? "error-message" : ""}`}>
              <span>{messageType === "error" ? "!" : "✓"}</span>
              {message}
            </div>
          )}

          {/* Home */}
          {page === "home" && (
            <>
              <section className="welcome-banner">
                <div>
                  <span className="tag">A LITTLE SPACE JUST FOR YOU</span>
                  <h1>Welcome back, {userName}! 💗</h1>
                  <p>
                    Every little moment matters. Let's save something beautiful today.
                  </p>
                  <button onClick={() => changePage("diary")}>
                    Write a memory ✨
                  </button>
                </div>
                <div className="welcome-decoration">🌷</div>
              </section>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>📖</span>
                  <div>
                    <strong>{diaryMemories.length}</strong>
                    <p>Total memories</p>
                  </div>
                </div>

                <div className="stat-card">
                  <span>💖</span>
                  <div>
                    <strong>{favoriteMemories.length}</strong>
                    <p>Favourite moments</p>
                  </div>
                </div>

                <div className="stat-card">
                  <span>🌈</span>
                  <div>
                    <strong>{moodHistory.length}</strong>
                    <p>Mood check-ins</p>
                  </div>
                </div>
              </div>

              <section className="home-section">
                <div className="section-heading">
                  <div>
                    <h3>Your little corner</h3>
                    <p>Choose what you would like to do today.</p>
                  </div>
                </div>

                <div className="dashboard-cards">
                  <div className="dash-card" onClick={() => changePage("diary")}>
                    <span>📖</span>
                    <h3>Write Diary</h3>
                    <p>Put your thoughts into words.</p>
                  </div>

                  <div className="dash-card" onClick={() => changePage("memories")}>
                    <span>💖</span>
                    <h3>My Memories</h3>
                    <p>Revisit your beautiful moments.</p>
                  </div>

                  <div className="dash-card" onClick={() => changePage("mood")}>
                    <span>😊</span>
                    <h3>Mood Tracker</h3>
                    <p>Check in with your feelings.</p>
                  </div>

                  <div className="dash-card" onClick={() => changePage("journey")}>
                    <span>🌷</span>
                    <h3>My Journey</h3>
                    <p>See your story unfold over time.</p>
                  </div>

                  <div className="dash-card" onClick={() => changePage("calendar")}>
                    <span>📅</span>
                    <h3>Calendar</h3>
                    <p>Explore memories by date.</p>
                  </div>
                </div>
              </section>

              <section className="home-section">
                <div className="section-heading">
                  <div>
                    <h3>Recently saved</h3>
                    <p>Your latest little moments.</p>
                  </div>
                  <button onClick={() => changePage("memories")}>
                    View all →
                  </button>
                </div>

                {diaryMemories.length === 0 ? (
                  <p className="empty-message">
                    Your memory collection is waiting for its first story. 🌸
                  </p>
                ) : (
                  diaryMemories.slice(0, 2).map(renderMemory)
                )}
              </section>
            </>
          )}

          {/* Diary */}
          {page === "diary" && (
            <section className="feature-page diary-page">
              <button className="back-btn" onClick={() => changePage("home")}>
                ← Back to Home
              </button>

              <div className="page-intro">
                <span>📝</span>
                <h2>Dear Diary...</h2>
                <p>Write freely. This little space is just for you.</p>
              </div>

              <label htmlFor="memory-date">Memory date</label>
              <input
                id="memory-date"
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
              />

              <label>Your thoughts</label>
              <textarea
                placeholder="Dear diary, today..."
                value={diary}
                onChange={(e) => setDiary(e.target.value)}
              />

              <label>Add a photo to this memory</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0], setImage)
                }
              />

              {image && (
                <div className="photo-preview">
                  <img src={image} alt="Diary preview" />
                  <button type="button" onClick={() => setImage("")}>
                    Remove photo
                  </button>
                </div>
              )}

              <button className="primary-action" onClick={saveDiary} disabled={saving}>
                {saving ? "Saving..." : "Save Memory 💖"}
              </button>
            </section>
          )}

          {/* Memories */}
          {page === "memories" && (
            <section className="feature-page">
              <div className="page-intro">
                <span>💌</span>
                <h2>My Memories</h2>
                <p>Every story here is a little piece of your life.</p>
              </div>

              {diaryMemories.length === 0 ? (
                <p className="empty-message">
                  No memories yet. Start writing your first diary! ✨
                </p>
              ) : (
                diaryMemories.map(renderMemory)
              )}
            </section>
          )}

          {/* Mood Tracker */}
          {page === "mood" && (
            <section className="feature-page mood-page">
              <button className="back-btn" onClick={() => changePage("home")}>
                ← Back to Home
              </button>

              <div className="page-intro">
                <span>🌷</span>
                <h2>How are you feeling today?</h2>
                <p>There is no right or wrong way to feel.</p>
              </div>

              <div className="mood-grid">
                {moods.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`mood-card ${mood === item.emoji ? "selected" : ""}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => setMood(item.emoji)}
                  >
                    <span>{item.emoji}</span>
                    <p>{item.name}</p>
                  </button>
                ))}
              </div>

              <div className="mood-result">
                <h3>Today's mood</h3>
                <div className="mood-result-icon">
  <MoodIcon name={selectedMood.name} size={58} />
</div>
                <h3>{selectedMood.name}</h3>
                <p>{selectedMood.message}</p>
                <button className="primary-action" onClick={saveMood} disabled={saving}>
                  {saving ? "Saving..." : "Save Today's Mood 💗"}
                </button>
              </div>

              <button className="text-link" onClick={() => changePage("history")}>
                View my mood history →
              </button>
            </section>
          )}

          {/* Mood History */}
          {page === "history" && (
            <section className="feature-page">
              <div className="page-intro">
                <span>🌈</span>
                <h2>Your Mood History</h2>
                <p>Look back at how you felt on different days.</p>
              </div>

              {moodHistory.length === 0 ? (
                <p className="empty-message">
                  No mood check-ins yet. Visit Mood Tracker and save your first mood! 🌷
                </p>
              ) : (
                moodHistory.map((entry) => (
                  <div className="mood-history-item" key={entry.id}>
                    <span className="mood-icon">
  <MoodIcon
    name={moods.find((item) => item.emoji === entry.mood)?.name || "Happy"}
    size={32}
  />
</span>
                    <div>
                      <strong>{entry.text.replace("Mood check-in: ", "")}</strong>
                      <p>{formatDate(entry.date)}</p>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}

          {/* Favourites */}
          {page === "favorites" && (
            <section className="feature-page">
              <div className="page-intro">
                <span>💝</span>
                <h2>Favourite Moments</h2>
                <p>The memories closest to your heart.</p>
              </div>

              {favoriteMemories.length === 0 ? (
                <p className="empty-message">
                  No favourites yet. Tap the heart on a memory to save it here. 💗
                </p>
              ) : (
                favoriteMemories.map(renderMemory)
              )}
            </section>
          )}

          {/* My Journey */}
          {page === "journey" && (
            <section className="feature-page">
              <button className="back-btn" onClick={() => changePage("home")}>
                ← Back to Home
              </button>

              <div className="page-intro">
                <span>🌷</span>
                <h2>Your Beautiful Journey</h2>
                <p>Every memory is a chapter of your story.</p>
              </div>

              {diaryMemories.length === 0 ? (
                <p className="empty-message">
                  Your journey is waiting to begin. Write your first diary memory! 💗
                </p>
              ) : (
                <div className="journey-timeline">
                  {diaryMemories
                    .slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((memory) => (
                      <div className="journey-entry" key={memory.id}>
                        <div className="journey-dot">✦</div>

                        <div className="journey-content">
                          <span>📅 {formatDate(memory.date)}</span>
                          <h3>✿ A moment to remember</h3>
                          <p>{memory.text}</p>

                          {memory.image && (
                            <img
                              className="memory-photo"
                              src={memory.image}
                              alt="Journey memory"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}

          {/* Calendar */}
          {page === "calendar" && (
            <section className="feature-page">
              <div className="page-intro">
                <span>📅</span>
                <h2>Memory Calendar</h2>
                <p>Select a date and revisit what happened.</p>
              </div>

              <label htmlFor="calendar-date">Choose a date:</label>
              <input
                id="calendar-date"
                type="date"
                value={calendarDate}
                onChange={(e) => setCalendarDate(e.target.value)}
              />

              <h3 className="calendar-result-heading">
                Memories on {formatDate(calendarDate)}
              </h3>

              {selectedMemories.length === 0 ? (
                <p className="empty-message">
                  No memories found for this date. Try another date! 💗
                </p>
              ) : (
                selectedMemories.map(renderMemory)
              )}
            </section>
          )}
        </main>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo">✦ Memora</h2>

        <div className="nav-links">
          <button onClick={() => setShowAuth(true)}>Login</button>
          <button className="signup-btn" onClick={() => setShowAuth(true)}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <span className="tag">YOUR PERSONAL MEMORY SPACE</span>

          <h1>
            Every moment
            <br />
            deserves to be
            <br />
            <span>remembered.</span>
          </h1>

          <p>
            A little space to write your thoughts, save your
            memories, and celebrate every feeling.
          </p>

          <button onClick={() => setShowAuth(true)}>
            Start Your Journey ✨
          </button>
        </div>

        <div className="memory-card">
          <span>🌸</span>
          <h3>Dear Diary...</h3>
          <p>
            Collect little moments, beautiful memories,
            and everything that makes your life special.
          </p>
          <div>♡ ✧ ♡</div>
        </div>
      </section>

      <section className="features">
        <h2>A little something for every day</h2>
        <p>Make every moment count with Memora.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <span>📖</span>
            <h3>Digital Diary</h3>
            <p>Write down your thoughts and daily experiences.</p>
          </div>

          <div className="feature-card">
            <span>💖</span>
            <h3>My Memories</h3>
            <p>Keep your favourite moments in one place.</p>
          </div>

          <div className="feature-card">
            <span>😊</span>
            <h3>Mood Tracker</h3>
            <p>Understand and express your daily feelings.</p>
          </div>

          <div className="feature-card">
            <span>📅</span>
            <h3>Memory Calendar</h3>
            <p>Look back at the moments that matter.</p>
          </div>
        </div>
      </section>

      <footer>
        Made with 💗 for your beautiful memories.
        <p>© 2026 Memora</p>
      </footer>
    </div>
  );
}

export default App;
