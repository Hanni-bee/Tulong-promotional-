"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Get In Touch</h2>
        <p className="text-center text-gray-600 mb-12">
          Email us at{" "}
          <a 
            href="mailto:tulongcapstone@gmail.com" 
            className="text-[#3498DB] hover:text-[#2980B9] font-semibold transition-colors"
          >
            tulongcapstone@gmail.com
          </a>
          {" "}or fill out the form below
        </p>
        <div className="neumorphic p-10">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4 text-[#27AE60]">✓</div>
              <p className="text-xl text-[#27AE60] font-semibold">Thank you for your message!</p>
              <p className="text-gray-600 mt-2">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Juan Dela Cruz"
                  required
                  className="w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., juan.delacruz@email.com"
                  required
                  className="w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition-all"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Inquiry about T.U.L.O.N.G device"
                  required
                  className="w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] transition-all"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide details about your inquiry or how we can help you..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498DB] resize-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#D32F2F] text-white font-bold rounded-lg neumorphic-sm hover:bg-[#B71C1C] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

