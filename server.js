import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("."));
app.use(express.json());

const upload = multer({ dest: "uploads/" });
if(!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.post("/upload", upload.single("file"), (req,res)=>{
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.writeFileSync("tra-dia-chi-web/data.json", JSON.stringify(data,null,2));
    fs.unlinkSync(filePath);
    res.json({success:true,data});
  } catch(e){ res.status(500).json({success:false,message:e.message}); }
});

app.post("/save", (req,res)=>{
  try { fs.writeFileSync("tra-dia-chi-web/data.json", JSON.stringify(req.body,null,2)); res.json({success:true}); }
  catch(e){ res.status(500).json({success:false,message:e.message}); }
});

app.listen(3000,()=>{console.log("Server chạy tại http://localhost:3000");});
