

const ManageAccount = () => {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Manage account</h1>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Account control</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-3 sm:pb-4">
          <div className="flex-1">
            <p className="font-medium">Delete account</p>
            <p className="text-xs sm:text-sm text-gray-500">Permanently remove your account and all associated data</p>
          </div>
          <button className="text-red-500 hover:text-red-600 w-full sm:w-auto text-left sm:text-right py-2 sm:py-0">
            Delete account
          </button>
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Account information</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-3 sm:pb-4">
          <div className="flex-1">
            <p className="font-medium">Account region</p>
            <p className="text-xs sm:text-sm text-gray-500">Your account region is initially set based on the time and place of registration.</p>
          </div>
          <div className="flex items-center text-gray-600 py-2 sm:py-0">
            <span>Japan</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Privacy</h2>
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Discoverability</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1">
              <p className="font-medium">Private account</p>
              <p className="text-xs sm:text-sm text-gray-500">
                With a private account, only users you approve can follow you and watch your videos.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Push notifications</h2>
        <div>
          <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Desktop notifications</h3>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1">
              <p className="font-medium">Allow in browser</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Stay on top of notifications for likes, comments, and more on desktop.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManageAccount;