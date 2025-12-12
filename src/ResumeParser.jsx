import React, { useState } from "react";

const ResumeParser = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    education: []
  });
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://resume-parser-1-g9u4.onrender.com/parse-resume", {
      method: "POST",
      body: formData
    });

    const json = await res.json();
    console.log(json);

    // Auto-fill the form
    setData({
      name: json.name || "",
      email: json.email || "",
      phone: json.phone || "",
      skills: json.skills || [],
      education: json.education || []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Upload Card */}
      <div
        data-aos="fade-down"
        className="relative backdrop-blur-xl bg-white/60 shadow-2xl rounded-3xl p-10 w-full max-w-lg mb-10
                 border border-white/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-500"
      >

        {/* Floating Glow */}
        <div className="absolute -top-6 -right-6 h-20 w-20 bg-indigo-300 blur-3xl opacity-40 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 h-20 w-20 bg-blue-300 blur-3xl opacity-40 rounded-full"></div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center flex items-center justify-center gap-3">
          <i className="fa-solid fa-file-circle-plus text-indigo-600 text-4xl animate-bounce"></i>
          Resume Parser
        </h1>

        {/* Label */}
        <label className="block font-semibold text-gray-700 mb-3 flex items-center gap-3 text-lg">
          <i className="fa-solid fa-upload text-indigo-600 text-xl"></i>
          Upload Resume (PDF)
        </label>

        {/* Upload Box */}
        <div
          className="relative border-2 border-dashed border-indigo-300 bg-white/70 hover:bg-indigo-50 transition 
                   p-6 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-3 shadow-sm"
        >
          <i className="fa-solid fa-cloud-arrow-up text-indigo-600 text-4xl"></i>
          <p className="text-gray-700 font-medium">Click to Upload Your Resume</p>

          {/* INPUT FIXED */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl 
                   font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center 
                   justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin text-white"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
              Parse Resume
            </>
          )}
        </button>
      </div>


      {/* Auto Filled Form */}
      <div
        data-aos="fade-up"
        className="backdrop-blur-xl bg-white/70 shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-white/30"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-indigo-600"></i>
          Auto Filled Details
        </h2>
        {/* Name */}
        <div className="mb-6 group">
          <label className="block font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-user text-indigo-600 text-lg"></i>
            Name
          </label>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-300 
      rounded-xl p-3 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <i className="fa-solid fa-id-card text-indigo-600 text-xl"></i>
            <input
              type="text"
              value={data.name}
              readOnly
              className="w-full bg-transparent outline-none text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6 group">
          <label className="block font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-envelope text-indigo-600 text-lg"></i>
            Email
          </label>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-300 
      rounded-xl p-3 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <i className="fa-solid fa-paper-plane text-indigo-600 text-xl"></i>
            <input
              type="text"
              value={data.email}
              readOnly
              className="w-full bg-transparent outline-none text-gray-900 font-medium"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="mb-6 group">
          <label className="block font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-phone text-indigo-600 text-lg"></i>
            Phone
          </label>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-300 
      rounded-xl p-3 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <i className="fa-solid fa-mobile-screen text-indigo-600 text-2xl"></i>
            <input
              type="text"
              value={data.phone}
              readOnly
              className="w-full bg-transparent outline-none text-gray-900 font-medium"
            />
          </div>
        </div>


        {/* Skills */}
        <div className="mb-10">
          <label className="block font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
            <i className="fa-solid fa-code text-indigo-600 text-xl"></i>
            Skills
          </label>

          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700
        shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <i className="fa-solid fa-check text-indigo-600 text-xs"></i>
                {skill}
              </div>
            ))}
          </div>
        </div>


        {/* Education */}
        <div>
          <label className="block font-medium text-gray-700 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-graduation-cap text-indigo-600 text-xl"></i>
            <span className="text-lg">Education</span>
          </label>

          <div className="relative border-l-4 border-indigo-400 pl-6">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                className="relative mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-1 border border-gray-200"
              >
                {/* Timeline Dot */}
                <span className="absolute -left-3 top-5 h-5 w-5 bg-indigo-600 rounded-full border-4 border-white"></span>

                {/* Degree */}
                <p className="flex items-center gap-2 mb-2 text-gray-900 font-semibold text-lg">
                  <i className="fa-solid fa-user-graduate text-indigo-600"></i>
                  {edu.degree}
                </p>

                {/* Institute */}
                <p className="flex items-center gap-2 text-gray-700 mb-1">
                  <i className="fa-solid fa-building-columns text-indigo-500"></i>
                  <span className="font-medium">Institute:</span> {edu.institute}
                </p>

                {/* Marks */}
                <p className="flex items-center gap-2 text-gray-700 mb-1">
                  <i className="fa-solid fa-chart-simple text-indigo-500"></i>
                  <span className="font-medium">Marks:</span> {edu.marks}
                </p>

                {/* Passout Year */}
                <p className="flex items-center gap-2 text-gray-700">
                  <i className="fa-solid fa-calendar-check text-indigo-500"></i>
                  <span className="font-medium">Passout:</span> {edu.passout_year}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>


  );
};

export default ResumeParser;
