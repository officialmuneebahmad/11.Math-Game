const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          This Game is Made with 💓 from 🇵🇰 for 🌎
        </p>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="https://github.com/officialmuneebahmad" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Developer
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy
          </a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>© {new Date().getFullYear()} MathStreak</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;