const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");


// json server url
const API_URL = "http://localhost:4444/todos";

// görevleri getirme ve gösterme
app.get("/", async (req, res) => {
    const todos = await fetch(API_URL).then(res => res.json());
    res.render("index", { todos });
});

// yeni görev ekleme
app.post("/add", async (req, res) => {
    const { title } = req.body;
    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ title, completed: false }),
        headers: { "Content-Type": "application/json" }
    });
    res.redirect("/");
});

// görev güncelleme (tamamlama durumu değiştir)
app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { title } = req.body; // Yeni başlığı al

    try {
        // güncellenen görevi al
        const todo = await fetch(`${API_URL}/${id}`).then(res => res.json());

        // güncelleme isteği gönder
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...todo,
                title: title // yeni başlık ekleme
            }),
            headers: { "Content-Type": "application/json" }
        });

        res.sendStatus(200); // başarılı
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.sendStatus(500);
    }
});



// görev silme
app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    res.redirect("/");
});

// görev tamamlama (checkbox ile işaretleme)
app.post("/toggle/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // mevcut görevi al
        const todo = await fetch(`${API_URL}/${id}`).then(res => res.json());

        // yeni tamamlanma durumunu kaydet
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                ...todo,
                completed: !todo.completed // mevcut durumun tersini kaydet
            }),
            headers: { "Content-Type": "application/json" }
        });

        res.sendStatus(200);
    } catch (error) {
        console.error("Tamamlama hatası:", error);
        res.sendStatus(500);
    }
});

// tüm görevleri göster
app.get("/", async (req, res) => {
    const todos = await fetch(API_URL).then(res => res.json());
    res.render("index", { todos });
});

// yapılacak görevleri göster 
app.get("/tasks/pending", async (req, res) => {
    const todos = await fetch(API_URL).then(res => res.json());
    const pendingTasks = todos.filter(todo => !todo.completed);
    res.render("index", { todos: pendingTasks });
});

// tamamlanmış görevleri göster
app.get("/tasks/completed", async (req, res) => {
    const todos = await fetch(API_URL).then(res => res.json());
    const completedTasks = todos.filter(todo => todo.completed);
    res.render("index", { todos: completedTasks });
});



app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));


