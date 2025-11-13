"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does T.U.L.O.N.G work without internet or cellular service?",
    answer: "T.U.L.O.N.G creates a local mesh network using dedicated disaster frequencies. Devices connect directly to each other, forming a network that relays messages across multiple devices to extend range without requiring any external infrastructure."
  },
  {
    question: "What is the range of T.U.L.O.N.G devices?",
    answer: "The direct range between two devices is approximately 100-500 meters depending on terrain. However, with mesh networking, messages can be relayed through multiple devices, effectively extending the range to several kilometers when devices are properly distributed."
  },
  {
    question: "How long does the emergency battery last?",
    answer: "The built-in battery can power the device for up to 48 hours of continuous operation and can charge a smartphone multiple times. The exact duration depends on usage patterns and the number of devices connected."
  },
  {
    question: "How do I set up T.U.L.O.N.G during an emergency?",
    answer: "Setup is simple: connect your phone to the T.U.L.O.N.G device via the provided interface, and the device automatically searches for and connects to nearby T.U.L.O.N.G networks. The intuitive interface guides you through the process in minutes."
  },
  {
    question: "Can T.U.L.O.N.G work during power outages?",
    answer: "Yes! T.U.L.O.N.G is specifically designed for power outages. The device has its own battery power source and can also charge your mobile phone, ensuring communication continues even when the grid is down."
  },
  {
    question: "How many people can use T.U.L.O.N.G simultaneously?",
    answer: "A single T.U.L.O.N.G network can support dozens of simultaneous users. The mesh architecture allows the network to scale as more devices join, making it ideal for community-level coordination during disasters."
  },
  {
    question: "Is T.U.L.O.N.G secure and private?",
    answer: "Yes, T.U.L.O.N.G uses encryption for all communications. Messages can be sent privately between two devices or broadcast to groups, giving users control over their communication privacy."
  },
  {
    question: "What types of disasters is T.U.L.O.N.G designed for?",
    answer: "T.U.L.O.N.G is designed for any disaster that disrupts communication infrastructure, including earthquakes, typhoons, floods, hurricanes, wildfires, and other emergencies where traditional communication fails."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-black">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="neumorphic overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</span>
                <span className={`text-2xl text-gray-600 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

