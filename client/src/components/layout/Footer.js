import React from 'react';
import { FiBookOpen, FiGithub, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <FiBookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">ExamSystem</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              A comprehensive online examination system built with modern technologies. 
              Empowering teachers and students with AI-powered exam creation and real-time analytics.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                <FiGithub className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                <FiMail className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  Features
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  Documentation
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Email: doijodeniranjan29a@gmail.com
              </li>
              <li className="text-gray-400">
                Phone: +91 9876543210
              </li>
              <li className="text-gray-400">
                Address: Kharghar Sec3 Bharati Vidyapeeth, Navi Mumbai
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ExamSystem. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <FiHeart className="h-4 w-4 mx-1 text-red-500" /> for education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
