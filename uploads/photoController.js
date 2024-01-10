import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/avatar/");
    },
    _filename: function (req, file, cb) {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
  
      const formattedDate = `${date.toDateString()}-${hours}:${minutes}`;
  
      cb(null, `${formattedDate}-${file.originalname}`);
    },
    get filename() {
      return this._filename;
    },
    set filename(value) {
      this._filename = value;
    },
  });
export default storage