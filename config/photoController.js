import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatar/");
  },
  _filename: function (req, file, cb) {
    const date = new Date();

    const formattedDate = `${date.toDateString()}`;

    cb(null, `${formattedDate}--${file.originalname}`);
  },
  get filename() {
    return this._filename;
  },
  set filename(value) {
    this._filename = value;
  },
});

export function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;

  const extname = path.extname(file.originalname).toLowerCase();

  const isAllowedExtension = filetypes.test(extname);

  const isAllowedMimetype = filetypes.test(file.mimetype);

  if (isAllowedExtension && isAllowedMimetype) {
    return cb(null, true);
  } else {
    const error = new Error("Only downloaded files with extensions are allowed jpeg, jpg, png, gif");
    error.status = 400;
    cb(error);
  }
}

export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Помилка Multer, можна обробити окремо
    return res.status(400).json({ error: "Multer Error", message: err.message });
  } else if (err) {
    // Інша помилка (включаючи ту, яку ви повертаєте в checkFileType)
    return res.status(err.status || 500).json({ error: "Server Error", message: err.message });
  }
  // Передайте управління далі, якщо це не помилка Multer або інша помилка
  next();
}
