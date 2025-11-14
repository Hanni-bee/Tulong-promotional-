import PillNav from "@/components/PillNav";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import ChromaGrid from "@/components/ChromaGrid";
import AnimatedIcon from "@/components/AnimatedIcon";
import ScrollAnimation from "@/components/ScrollAnimation";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#faq', label: 'FAQ' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <main className="min-h-screen relative">
      <ScrollProgress />
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4 flex justify-center">
        <PillNav
          logo="/logo.png"
          logoAlt="T.U.L.O.N.G Logo"
          items={navItems}
          baseColor="#ffffff"
          pillColor="#f5f5f5"
          hoveredPillTextColor="#D32F2F"
          pillTextColor="#2C2C2C"
          className="shadow-2xl"
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: '#8B1A1A',
              boxShadow: '0 20px 60px rgba(139, 26, 26, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="p-8 md:p-12 lg:p-16 text-white relative z-10">
              <div className="mb-6">
                <img 
                  src="/logo.png" 
                  alt="T.U.L.O.N.G Logo" 
                  className="h-16 w-16 md:h-20 md:w-20 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                We are Your<br />
                <span className="text-[#FFD700]">#1</span><br />
                Disaster<br />
                Communication<br />
                Solution
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed max-w-2xl">
                Take charge during emergencies with our offline network generation system. 
                When disaster strikes, T.U.L.O.N.G keeps you connected.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#download" 
                  className="px-10 py-5 bg-[#5C0E0E] hover:bg-[#6B1515] text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-2xl active:scale-95"
                  style={{
                    boxShadow: '0 10px 30px rgba(92, 14, 14, 0.5), 0 0 20px rgba(92, 14, 14, 0.3)'
                  }}
                >
                  Download App Now
                </a>
                <a 
                  href="#contact" 
                  className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl border-2 border-white/30 active:scale-95"
                >
                  Contact Us
                </a>
              </div>
            </div>
            {/* Decorative gradient overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)'
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Statistics/Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">The Impact of Communication Failure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { stat: "80%", label: "of disaster areas lose communication within first hour", color: "red" },
              { stat: "72hrs", label: "average time before infrastructure restoration", color: "orange" },
              { stat: "1000+", label: "lives could be saved with better emergency communication", color: "blue" },
            ].map((item, index) => (
              <div key={index} className="neumorphic p-8 text-center">
                <div className={`text-5xl font-bold mb-4 ${
                  item.color === "red" ? "text-[#D32F2F]" :
                  item.color === "orange" ? "text-[#E67E22]" :
                  "text-[#3498DB]"
                }`}>
                  {item.stat}
                </div>
                <p className="text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Why Choose T.U.L.O.N.G?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Instant Setup", desc: "Ready in minutes, no complex configuration", animation: "pulse" as const, color: "#E67E22" },
              { icon: "🛡️", title: "Reliable", desc: "Works when all else fails", animation: "glow" as const, color: "#3498DB" },
              { icon: "🔒", title: "Secure", desc: "Encrypted communications for privacy", animation: "shake" as const, color: "#E67E22" },
              { icon: "🌍", title: "Scalable", desc: "Network grows with more devices", animation: "float" as const, color: "#27AE60" },
            ].map((benefit, index) => (
              <div key={index} className="neumorphic p-6 text-center hover:neumorphic-lg transition-all group">
                <div className="mb-4 flex justify-center">
                  <AnimatedIcon 
                    emoji={benefit.icon} 
                    animationType={benefit.animation}
                    size="lg"
                    color={benefit.color}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Offline Messaging",
                description: "Exchange short messages for coordination without GSM, Wi-Fi, or internet",
                color: "blue",
                icon: "💬",
              },
              {
                title: "Voice Communication",
                description: "Real-time two-way conversations that go beyond walkie-talkie limitations",
                color: "green",
                icon: "🎤",
              },
              {
                title: "Mesh Networking",
                description: "Automatically relays messages across nearby devices to extend range",
                color: "orange",
                icon: "🌐",
              },
              {
                title: "Emergency Power",
                description: "Built-in backup battery doubles as a power bank for smartphones",
                color: "red",
                icon: "🔋",
              },
              {
                title: "Private & Group Chat",
                description: "Direct device-to-device exchange and community-level announcements",
                color: "blue",
                icon: "👥",
              },
              {
                title: "Location Sharing",
                description: "Share location updates, safety alerts, and urgent requests",
                color: "green",
                icon: "📍",
              },
            ].map((feature, index) => {
              const animations: Array<'pulse' | 'bounce' | 'rotate' | 'shake' | 'glow' | 'float'> = ['pulse', 'bounce', 'float', 'glow', 'shake', 'float'];
              const colors = ['#3498DB', '#27AE60', '#E67E22', '#D32F2F', '#3498DB', '#27AE60'];
              return (
                <div key={index} className="neumorphic p-6 hover:neumorphic-lg transition-all group">
                  <div className="mb-4 flex justify-center">
                    <AnimatedIcon 
                      emoji={feature.icon} 
                      animationType={animations[index % animations.length]}
                      size="md"
                      color={colors[index % colors.length]}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Connect Device",
                description: "Connect your mobile phone to the T.U.L.O.N.G device via the provided interface",
                icon: "🔌",
              },
              {
                step: "2",
                title: "Auto-Discovery",
                description: "Device automatically searches for and connects to nearby T.U.L.O.N.G networks",
                icon: "🔍",
              },
              {
                step: "3",
                title: "Mesh Formation",
                description: "Multiple devices form a mesh network, extending communication range",
                icon: "🌐",
              },
              {
                step: "4",
                title: "Communicate",
                description: "Send messages, make voice calls, and share information within the network",
                icon: "💬",
              },
            ].map((step, index) => {
              const animations: Array<'pulse' | 'bounce' | 'rotate' | 'shake' | 'glow' | 'float'> = ['pulse', 'bounce', 'float', 'glow'];
              return (
                <div key={index} className="neumorphic p-6 text-center relative group">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#D32F2F] flex items-center justify-center text-white font-bold text-xl z-10 animate-icon-pulse">
                    {step.step}
                  </div>
                  <div className="mb-4 mt-4 flex justify-center">
                    <AnimatedIcon 
                      emoji={step.icon} 
                      animationType={animations[index]}
                      size="lg"
                      color="#3498DB"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#3498DB] text-2xl animate-pulse">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Use Cases/Scenarios Section */}
      <section id="use-cases" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Real-World Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                scenario: "Earthquake",
                icon: "🌍",
                problem: "Buildings collapse, power lines down, cellular towers destroyed",
                solution: "T.U.L.O.N.G enables survivors to coordinate rescue efforts and locate trapped individuals",
                color: "red",
              },
              {
                scenario: "Typhoon",
                icon: "🌀",
                problem: "Flooding cuts off entire communities, communication infrastructure submerged",
                solution: "Mesh network allows evacuation coordination and emergency resource sharing",
                color: "blue",
              },
              {
                scenario: "Flood",
                icon: "🌊",
                problem: "Water damage to electrical systems, no power for days",
                solution: "Emergency battery keeps devices powered while maintaining critical communication",
                color: "green",
              },
            ].map((useCase, index) => {
              const scenarioColors = ['#D32F2F', '#3498DB', '#27AE60'];
              const scenarioAnimations: Array<'pulse' | 'bounce' | 'rotate' | 'shake' | 'glow' | 'float'> = ['shake', 'float', 'pulse'];
              return (
                <div key={index} className="neumorphic p-6 group">
                  <div className="mb-4 flex justify-center">
                    <AnimatedIcon 
                      emoji={useCase.icon} 
                      animationType={scenarioAnimations[index]}
                      size="lg"
                      color={scenarioColors[index]}
                    />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 text-center ${
                    useCase.color === "red" ? "text-[#D32F2F]" :
                    useCase.color === "blue" ? "text-[#3498DB]" :
                    "text-[#27AE60]"
                  }`}>
                    {useCase.scenario}
                  </h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[#E67E22] mb-2">Problem:</p>
                  <p className="text-gray-600 text-sm">{useCase.problem}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#27AE60] mb-2">Solution:</p>
                  <p className="text-gray-700 text-sm">{useCase.solution}</p>
                </div>
                </div>
              );
            })}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Objectives Section */}
      <section id="objectives" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Provide a reliable channel for communication in areas where cellular, Wi-Fi, and internet services are down",
              "Enable both direct personal communication and group-oriented coordination channels",
              "Support short text exchange as well as continuous two-way voice conversations for clearer situational awareness",
              "Implement a mesh-based network structure that extends communication coverage by linking multiple nearby devices",
              "Deliver a simple, intuitive interface for mobile users to minimize setup time during emergencies",
              "Integrate a backup charging feature that supplies emergency power to mobile phones",
              "Promote coordinated responses by allowing survivors to share location updates, safety alerts, and urgent requests",
            ].map((objective, index) => (
              <div key={index} className="neumorphic p-6 flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D32F2F] flex items-center justify-center text-white font-bold mr-4">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1">{objective}</p>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Scope Section */}
      <section id="scope" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Offline Local Network",
                description: "Enables communication without GSM, Wi-Fi, or internet",
              },
              {
                title: "Flexible Messaging Modes",
                description: "Supports personal device-to-device exchange as well as community-level announcements",
              },
              {
                title: "Voice Communication",
                description: "Provides natural, real-time two-way conversations",
              },
              {
                title: "Mesh Networking",
                description: "Automatically relays messages across nearby devices to extend range and maintain network resilience",
              },
              {
                title: "Emergency Power",
                description: "Built-in backup battery doubles as a power bank for smartphones",
              },
            ].map((item, index) => (
              <div key={index} className="neumorphic p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">T.U.L.O.N.G vs Traditional Communication</h2>
          <div className="neumorphic p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-4 px-4 text-gray-800 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-[#27AE60] font-semibold">T.U.L.O.N.G</th>
                  <th className="text-center py-4 px-4 text-gray-600 font-semibold">Cellular</th>
                  <th className="text-center py-4 px-4 text-gray-600 font-semibold">Wi-Fi</th>
                  <th className="text-center py-4 px-4 text-gray-600 font-semibold">Walkie-Talkie</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Works Without Infrastructure", tulong: "✓", others: ["✗", "✗", "Partial"] },
                  { feature: "Mesh Networking", tulong: "✓", others: ["✗", "✗", "✗"] },
                  { feature: "Voice Communication", tulong: "✓", others: ["✓", "✓", "✓"] },
                  { feature: "Text Messaging", tulong: "✓", others: ["✓", "✓", "✗"] },
                  { feature: "Emergency Power", tulong: "✓", others: ["✗", "✗", "Partial"] },
                  { feature: "Works in Disasters", tulong: "✓", others: ["✗", "✗", "Partial"] },
                  { feature: "Range Extension", tulong: "✓", others: ["✗", "✗", "✗"] },
                  { feature: "No Monthly Fees", tulong: "✓", others: ["✗", "Partial", "✓"] },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-[#27AE60] text-xl font-bold">{row.tulong}</span>
                    </td>
                    {row.others.map((other, i) => (
                      <td key={i} className="py-4 px-4 text-center text-gray-600">{other}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Testimonials/Quotes Section */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "In disaster scenarios, communication is critical. T.U.L.O.N.G fills a crucial gap when traditional systems fail.",
                author: "Emergency Response Expert",
                role: "Disaster Management",
              },
              {
                quote: "The mesh networking capability extends communication range significantly, making it ideal for community coordination.",
                author: "Network Engineer",
                role: "Telecommunications",
              },
              {
                quote: "Having emergency power built-in means we can stay connected even during extended blackouts. This is a game-changer.",
                author: "Community Leader",
                role: "Disaster Preparedness",
              },
            ].map((testimonial, index) => (
              <div key={index} className="neumorphic p-6">
                <div className="text-4xl text-gray-400 mb-4">"</div>
                <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-800 font-semibold">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <div className="neumorphic p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-black">Ready to Learn More?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join us in revolutionizing disaster communication. Get in touch to learn more about T.U.L.O.N.G 
              and how it can help your community prepare for emergencies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#contact" className="px-8 py-4 bg-[#D32F2F] text-white font-bold rounded-lg neumorphic-sm hover:bg-[#B71C1C] transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Contact Us
              </a>
              <a href="#about" className="px-8 py-4 bg-[#3498DB] text-white font-bold rounded-lg neumorphic-sm hover:bg-[#2980B9] transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Learn More
              </a>
            </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* Limitations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <div className="neumorphic p-10">
            <h2 className="text-3xl font-bold text-black mb-6">Limitations</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#E67E22] mr-3">•</span>
                <span>Not intended for internet use, media sharing, or long-distance transmission beyond the mesh</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E67E22] mr-3">•</span>
                <span>Operates on fixed disaster-dedicated frequencies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E67E22] mr-3">•</span>
                <span>Network effectiveness depends on the density and placement of deployed devices</span>
              </li>
            </ul>
            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <ContactForm />

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <ScrollAnimation>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-black">About T.U.L.O.N.G</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              T.U.L.O.N.G is centered on resilience, collaboration, and the urgent need for 
              communication when traditional infrastructure is no longer available. Our design 
              ensures that mobile devices remain usable even during extended blackouts, 
              supporting both individual and community-level communication in times of crisis.
            </p>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-black">Our Team</h3>
            
            <div className="neumorphic p-6 md:p-10 min-h-[600px]">
              <ChromaGrid
                items={[
                  {
                    image: '/jhunel.jpg',
                    title: 'Mark Jhunel Garcia',
                    subtitle: 'Project Manager',
                    borderColor: '#D32F2F',
                    gradient: 'linear-gradient(145deg, #D32F2F, #1a1a1a)',
                  },
                  {
                    image: '/Acec.jpg',
                    title: 'Ace-c B. Anabo',
                    subtitle: 'Hardware Engineer',
                    borderColor: '#E67E22',
                    gradient: 'linear-gradient(210deg, #E67E22, #1a1a1a)',
                  },
                  {
                    image: '/sean.jpg',
                    title: 'Sean Spencer Encarnacion',
                    subtitle: 'Hardware Engineer',
                    borderColor: '#E67E22',
                    gradient: 'linear-gradient(165deg, #E67E22, #1a1a1a)',
                  },
                  {
                    image: '/Lexter Angelo Alonzo.jpg',
                    title: 'Lexter Angelo Alonzo',
                    subtitle: 'Software Engineer',
                    borderColor: '#3498DB',
                    gradient: 'linear-gradient(195deg, #3498DB, #1a1a1a)',
                  },
                  {
                    image: '/Hanniel.jpg',
                    title: 'Hanniel Asher T. Cabanding',
                    subtitle: 'Software Engineer',
                    borderColor: '#3498DB',
                    gradient: 'linear-gradient(225deg, #3498DB, #1a1a1a)',
                  },
                  {
                    image: '/John leonard.jpg',
                    title: 'John Leonard Galorio',
                    subtitle: 'Researcher',
                    borderColor: '#27AE60',
                    gradient: 'linear-gradient(135deg, #27AE60, #1a1a1a)',
                  },
                  {
                    image: '/Timm.jpg',
                    title: 'Timothy O. Laru-an',
                    subtitle: 'Researcher',
                    borderColor: '#27AE60',
                    gradient: 'linear-gradient(180deg, #27AE60, #1a1a1a)',
                  },
                  {
                    image: '/jan.jpg',
                    title: 'Jan Elaizha Buenabajo',
                    subtitle: 'Researcher',
                    borderColor: '#27AE60',
                    gradient: 'linear-gradient(150deg, #27AE60, #1a1a1a)',
                  },
                ]}
                radius={350}
                damping={0.5}
                fadeOut={0.7}
              />
            </div>
          </div>
          </div>
        </ScrollAnimation>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}

