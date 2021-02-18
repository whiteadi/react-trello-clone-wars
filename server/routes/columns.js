const express = require('express');
const router = express.Router();
var db = require("../database.js")

router.get("/api/columns", (req, res, next) => {
    var sql = "select * from columns"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

router.get("/api/columns/:id", (req, res, next) => {
    var sql = "select * from columns where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

router.post("/api/columns/", (req, res, next) => {
    var errors=[]
    if (!req.body.label){
        errors.push("No label specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.label
    }
    var sql ='INSERT INTO columns (label) VALUES (?)'
    var params =[data.label]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

module.exports = router;