const Student = require("../models/student");
const Counter = require("../models/counters");
const Admin = require("../models/admin");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const registerStudent = async (req, res) => {
    var { email, studentName, contactNumber } = req.body;
    console.log(email);
    try {
        const student = await Student.findOne({
            email: email
        });
        if (student) {
            return res.status(200).json({
                message: "Student already exists",
                student: {
                    id: student.id,
                    studentName: student.studentName,
                    email: student.email,
                    contactNumber: student.contactNumber,
                    transactionCount: student.transactionCount
                },
                isUser: true
            });
        } else {
            if (email &&
                studentName &&
                contactNumber) {
                const studentId = await Counter.findOne({ idName: "Student" });
                var count = parseInt(studentId.value);
                count++;
                Student.create({
                    id: count.toString(),
                    email: email,
                    studentName: studentName,
                    contactNumber: contactNumber,
                    transactionCount: "0",
                })
                    .then(async (student) => {
                        await Counter.findByIdAndUpdate(studentId._id, { $set: { value: count.toString() } })
                        if (student) {
                            res.statusCode = 200;
                            res.json({ message: "Student Created Successfully", student: student });
                        }
                        else {
                            res.statusCode = 400;
                            res.json({ message: "Error in Student Register", });
                        }
                    })
            } else {
                return res.status(400).json({
                    message:
                        "Provide All Required Inputs",
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const updateStudent = async (req, res) => {
    var newStudent = req.body;
    try {
        const student = await Student.findOne({
            id: newStudent.id
        });
        if (student) {
            const updated = await Student.findOneAndUpdate({ _id: student._id }, newStudent);
            if (updated) {
                return res.status(200).json({
                    message: "Student Details Updated",
                    student: {
                        id: newStudent.id,
                        studentName: newStudent.studentName,
                        email: newStudent.email,
                        contactNumber: newStudent.contactNumber,
                        transactionCount: student.transactionCount
                    },
                    isUser: true
                });
            } else {
                res.statusCode = 400;
                res.json({ message: "Error in Updation", });
            }
        } else {
            res.statusCode = 400;
            res.json({ message: "Student Does Not Exist", });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const removeStudent = async (req, res) => {
    const { id, password } = req.query;
    const { authorization } = req.headers;
    const email = authorization.split(" ")[1];
    console.log(email);
    try {
        const student = await Student.findOne({
            id: id
        }).then(async (student) => {
            const admin = await Admin.findOne({ email: email });
            if (admin.password == password) {
                Student.findByIdAndDelete(student._id, {})
                    .then(() => {
                        return res.status(200).json({
                            message: "Student Removed",
                        });
                    })
            } else {
                return res.status(400).json({
                    message: "Wrong Admin Credentials",
                });
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }

}

module.exports = { registerStudent, updateStudent, removeStudent };
