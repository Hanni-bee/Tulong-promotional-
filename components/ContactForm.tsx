"use client";

import { useState } from "react";
import ScrollAnimation from "./ScrollAnimation";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  return (
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <ScrollAnimation>
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
          {" "}or call us at{" "}
          <a 
            href="tel:+639123456789" 
            className="text-[#3498DB] hover:text-[#2980B9] font-semibold transition-colors"
          >
            +63 912 345 6789
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
                  className={`w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "focus:ring-[#D32F2F] border-2 border-[#D32F2F]" : "focus:ring-[#3498DB]"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-[#D32F2F]">{errors.name}</p>
                )}
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
                  className={`w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "focus:ring-[#D32F2F] border-2 border-[#D32F2F]" : "focus:ring-[#3498DB]"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#D32F2F]">{errors.email}</p>
                )}
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
                  className={`w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.subject ? "focus:ring-[#D32F2F] border-2 border-[#D32F2F]" : "focus:ring-[#3498DB]"
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-[#D32F2F]">{errors.subject}</p>
                )}
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
                  className={`w-full px-4 py-3 neumorphic-inset bg-[#f5f5f5] text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${
                    errors.message ? "focus:ring-[#D32F2F] border-2 border-[#D32F2F]" : "focus:ring-[#3498DB]"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-[#D32F2F]">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-[#D32F2F] text-white font-bold rounded-lg neumorphic-sm hover:bg-[#B71C1C] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
        </div>
      </ScrollAnimation>
    </section>
  );
}

