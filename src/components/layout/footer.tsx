import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Products',
      links: [
        { name: 'Browse Products', href: '/products' },
        { name: 'Post Product', href: '/products/new' },
        { name: 'Categories', href: '/categories' },
        { name: 'Featured Products', href: '/products?featured=true' },
      ],
    },
    {
      title: 'Trade',
      links: [
        { name: 'Trade Suggestions', href: '/trade-suggestions' },
        { name: 'Submit Requirement', href: '/trade-suggestions/new' },
        { name: 'Find Suppliers', href: '/suppliers' },
        { name: 'Find Buyers', href: '/buyers' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Guides', href: '/guides' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-400">Exi-port</span>
                <span className="text-2xl font-bold text-white">.com</span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Your global gateway to international trade. Connect with exporters, importers, 
                and trade partners worldwide to grow your business.
              </p>
              
              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-5 w-5 mr-3 text-blue-400" />
                  <span>support@exi-port.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-5 w-5 mr-3 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Global Trade Center, International City</span>
                </div>
              </div>
            </div>

            {/* Footer links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Get the latest trade opportunities and market insights delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="mt-2 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md sm:rounded-l-none transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-300 mb-4 md:mb-0">
              <p>&copy; {currentYear} Exi-port.com. All rights reserved.</p>
            </div>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
