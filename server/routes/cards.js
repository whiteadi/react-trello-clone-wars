const express = require('express');
const router = express.Router();
var db = require("../database.js")

router.get("/api/cards/column/:id", (req, res, next) => {
    var sql = "select * from cards where columnid = ?"
    var params = [req.params.id]
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

router.get("/api/cards/:id", (req, res, next) => {
    var sql = "select * from cards where id = ?"
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

router.post("/api/cards/", (req, res, next) => {
    var errors=[]
    if (!req.body.description){
        errors.push("No description specified");
    }
    if (!req.body.columnId){
        errors.push("No column specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        description: req.body.description,
        columnId: req.body.columnId
    }
    var sql ='INSERT INTO cards (description, columnid) VALUES (?,?)'
    var params =[data.description, data.columnId]
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

// update description or parent column for drag and drop
router.patch("/api/cards/:id", (req, res, next) => {
    var data = {
        description: req.body.description,
        columnId: req.body.columnId
    }
    db.run(
        `UPDATE cards set 
           description = COALESCE(?,description),
           columnid = COALESCE(?,columnId) 
           WHERE id = ?`,
        [data.description, data.columnId, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

module.exports = router;