import Image from "next/image";

export default function Nav() {
  return (
    <div className="flex w-full justify-between border border-slate-200 p-3">
      <Image
        src="/icons/hamburger.svg"
        width={20}
        height={20}
        alt="hamburger"
        className="mx-2"
      />
      <div className="mx-2 flex gap-2">
        <Image
          src="/icons/medal.svg"
          width={20}
          height={20}
          alt="medal"
          className="mx-2"
        />
        <Image
          src="/icons/circle-help.svg"
          width={20}
          height={20}
          alt="help"
          className="mx-2"
        />
        <Image
          src="/icons/settings.svg"
          width={20}
          height={20}
          alt="settings button"
          className="mx-2"
        />
      </div>
    </div>
  );
}
