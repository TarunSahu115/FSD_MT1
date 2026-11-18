
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initial enrollment records
let enrollments = [
    {
        id: 601,
        studentName: "Aarav Gupta",
        courseCode: "CS301",
        courseName: "Data Structures",
        semester: 3,
        attendance: 82
    },
    {
        id: 602,
        studentName: "Meera Joshi",
        courseCode: "CS305",
        courseName: "Database Systems",
        semester: 3,
        attendance: 74
    },
    {
        id: 603,
        studentName: "Kabir Khan",
        courseCode: "CS310",
        courseName: "Computer Networks",
        semester: 3,
        attendance: 91
    }
];

let nextId = 604;

// Validation function
function validate(data) {
    return data &&
        typeof data.studentName === "string" &&
        data.studentName.trim() !== "" &&
        typeof data.courseCode === "string" &&
        data.courseCode.trim() !== "" &&
        typeof data.courseName === "string" &&
        data.courseName.trim() !== "" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.attendance === "number" &&
        data.attendance >= 0 &&
        data.attendance <= 100;
}

// 1. GET ALL ENROLLMENTS
app.get("/api/enrollments", (req, res) => {
    res.status(200).json(enrollments);
});

// 2. POST NEW ENROLLMENT
app.post("/api/enrollments", (req, res) => {
    const data = req.body;

    if (!validate(data)) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const newEnrollment = {
        id: nextId++,
        studentName: data.studentName.trim(),
        courseCode: data.courseCode.trim(),
        courseName: data.courseName.trim(),
        semester: data.semester,
        attendance: data.attendance
    };

    enrollments.push(newEnrollment);

    res.status(201).json(newEnrollment);
});

// 3. FILTER BY SEMESTER
app.get("/api/enrollments/filter", (req, res) => {
    const semester = req.query.semester;

    if (semester === undefined ||
        !/^[1-9]\d*$/.test(semester)) {
        return res.status(400).json({
            message: "Valid semester is required"
        });
    }

    const result = enrollments.filter(
        e => String(e.semester) === semester
    );

    res.status(200).json(result);
});

// 4. LOW ATTENDANCE
app.get("/api/enrollments/low-attendance", (req, res) => {
    const result = enrollments.filter(
        e => e.attendance < 75
    );

    res.status(200).json(result);
});

// 5. GET ENROLLMENT BY ID
app.get("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const record = enrollments.find(e => e.id === id);

    if (!record) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    res.status(200).json(record);
});

// 6. UPDATE ENROLLMENT
app.put("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    if (!validate(req.body)) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    enrollments[index] = {
        id: id,
        studentName: req.body.studentName.trim(),
        courseCode: req.body.courseCode.trim(),
        courseName: req.body.courseName.trim(),
        semester: req.body.semester,
        attendance: req.body.attendance
    };

    res.status(200).json(enrollments[index]);
});

// 7. DELETE ENROLLMENT
app.delete("/api/enrollments/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Enrollment not found"
        });
    }

    enrollments.splice(index, 1);

    res.status(200).json({
        message: "Enrollment deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
