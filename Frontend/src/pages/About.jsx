import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Users, Award, Truck, Shield } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Made with Love",
      description: "Every soft toy is crafted with care and attention to detail"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Premium Quality",
      description: "Only the finest materials for the softest, safest toys"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "For All Ages",
      description: "From babies to collectors, we have something for everyone"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: "Award Winning",
      description: "Recognized for excellence in toy design and safety"
    },
    {
      icon: <Truck className="h-8 w-8 text-green-500" />,
      title: "Fast Delivery",
      description: "Quick and secure shipping to bring joy to your doorstep"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Safety First",
      description: "All toys meet international safety standards"
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      description: "Passionate about bringing joy through cuddly companions"
    },
    {
      name: "Mike Chen",
      role: "Head of Design",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      description: "Creating adorable designs that capture hearts"
    },
    {
      name: "Emily Davis",
      role: "Quality Manager",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      description: "Ensuring every toy meets our high standards"
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-display font-bold text-gradient mb-6"
            >
              About CuddlyPuff 🧸
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            >
              We believe that everyone deserves a cuddly companion. Since 2020, we've been creating 
              premium soft toys that bring comfort, joy, and endless smiles to people of all ages.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-gradient mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  CuddlyPuff was born from a simple belief: that soft toys are more than just 
                  playthings. They're companions, comfort providers, and keepers of precious memories.
                </p>
                <p>
                  Founded by a team of toy enthusiasts and parents, we set out to create the 
                  softest, safest, and most lovable toys in the world. Every design starts with 
                  a story, and every toy is made to become part of yours.
                </p>
                <p>
                  Today, we're proud to have brought smiles to thousands of families worldwide, 
                  and we're just getting started on our mission to spread cuddles and joy everywhere.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center animate-bounce-slow">
                <span className="text-white text-3xl">🎈</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gradient mb-4">
              Why Choose CuddlyPuff?
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to excellence in every aspect of our business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4 flex justify-center group-hover:animate-bounce">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gradient mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind CuddlyPuff
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center group"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👋</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Our Values
            </h2>
            <p className="text-xl text-white/90">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Quality", description: "Never compromising on materials or craftsmanship" },
              { title: "Safety", description: "Every toy meets the highest safety standards" },
              { title: "Joy", description: "Creating products that bring happiness" },
              { title: "Sustainability", description: "Caring for our planet's future" }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-white/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-gradient mb-4">
              Ready to Find Your Perfect Cuddle Buddy?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore our collection and discover the joy of CuddlyPuff
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/products'}
              className="btn-primary text-lg px-8 py-4"
            >
              Shop Now 🛍️
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About