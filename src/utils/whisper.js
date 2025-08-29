import { spawn } from "child_process";
import path from "path";

export const whisper = (file_name) => {
  return new Promise((resolve, reject) => {
    const file_path = path.join( "C:", "Users","prana","Desktop","W","Bytelearn Content","Extracted_audios",`${file_name}.mp3`);

    const output_path = path.join("C:", "Users", "prana","Desktop","W","Bytelearn Content","Text_files",);

    console.log(`started whisper on ${file_name}.mp3`)
    const create_text = spawn("whisper", [ file_path,"--model","base","--output_format","txt","--output_dir",output_path,]);

    create_text.once("close", (code) => {
      if (code === 0) {
        resolve({
          message: "Successfully created text file using whisper",
          txt_filename: `${file_name}`
        });
      } else {
        reject(new Error(`whisper exited with error code ${code}`));
      }
    });

    create_text.once("error", (err) => {
      reject(err);
    });
  });
};
