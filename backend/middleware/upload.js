import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//__filename — ағымдағы файлдың толық жолы.
//__dirname — осы файл орналасқан папка жолы.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

//destination — файл қайда сақталады.
//filename — файл атауы қалай қойылады.

const upload = multer({ storage });

export default upload;
