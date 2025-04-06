export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Vehicle Finance</h3>
            <p className="text-gray-300">Your trusted partner for quality vehicles and affordable financing options.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Phone: +27 074 518 5189
              <br />
              Email: thembahectormkhwanazi@gmail.com
              <br />
              Address: 123 Car Street, Auto City
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <p className="text-gray-300">
              Monday - Friday: 8am - 5pm
              <br />
              Saturday: 9am - 3pm
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Vehicle Finance. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}

