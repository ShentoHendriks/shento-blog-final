import Image from "next/image";

export function FileStructure({ children }) {
  return (
    <div className="bg-[#293056] p-10 flex text-[14px] justify-center items-center rounded-md flex-col my-[1.7em]">
      <div>{children}</div>
    </div>
  );
}

export function File({ children, level = 0, type = "file", focus = false }) {
  if (level == 0) {
    level = 14;
  } else {
    level = 14 + level * 28;
  }
  return (
    <div
      style={{ paddingLeft: level + "px" }}
      className={`bg-white relative first-of-type:rounded-t-md pr-8 ${
        focus && "font-bold"
      } first-of-type:border-b-[#D5D9EB]
      
    last-of-type:border-t-[#D5D9EB] p-3.5 border-y-[#D5D9EB] border-[0.5px] last-of-type:rounded-b-md pr-[7em]`}>
      <div className="flex items-center justify-start gap-3">
        <img
          className="border-none w-4 h-4 m-0 rounded-none !my-0"
          src={`${type == "file" ? "file.svg" : "folder.svg"}`}
          alt="Icon"
        />
        <p className="m-0">{children}</p>
        {focus && (
          <span className="w-2 h-2 rounded-full absolute right-5 bg-[#3E4784]"></span>
        )}
      </div>
    </div>
  );
}
