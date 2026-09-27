"use client";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactDrawer({
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[480px]
        bg-[#0B0E16] z-50 transition-transform duration-500
        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="p-10">

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ×
          </button>

          <h2 className="text-6xl font-serif text-white mb-8">
            Message{" "}
            <span className="text-[#df7d57]">
              me
            </span>
          </h2>

          <div className="space-y-8 text-gray-300 text-lg leading-9">

            <p>
              If you want to send me a quick
              important message, you can do so
              using WhatsApp.
            </p>

            <p>
              For general enquiries please use
              the enquiry form.
            </p>

            <p>
              Feel free to arrange a personal
              discussion or video call.
            </p>

          </div>

          <div className="flex justify-between mt-14">

            <button
  onClick={() =>
    window.open(
      "https://wa.me/8097075054?text=Hi%20Prasanna,%20I%20went%20through%20your%20work.%20You%20seem%20annoyingly%20talented,%20so%20I%20suppose%20we%20should%20talk%20about%20my%20project.",
      "_blank"
    )
  }
  className="bg-[#df7d57] text-black px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
>
  SEND MESSAGE
</button>

            <a
  href="https://wa.me/8097075054?text=Hi%20Prasanna,%20I%20went%20through%20your%20work.%20You%20seem%20annoyingly%20talented,%20so%20I%20suppose%20we%20should%20talk%20about%20my%20project."
  target="_blank"
  rel="noopener noreferrer"
  className="bg-green-500 w-16 h-16 rounded-xl text-white text-3xl flex items-center justify-center hover:scale-105 transition"
>
  <FaWhatsapp />
</a>

          </div>

        </div>
      </div>
    </>
  );
}