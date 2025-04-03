import React from 'react';
import { MessageSquare, Phone, Video, X, Mail, MapPin } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

function ProfileModal({ isOpen, closeModal, user }) {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-3 w-4 h-4 rounded-full border-2 border-white ${
                          user?.online ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.bio}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>{user?.location}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center space-x-4">
                    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </button> */}
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </button>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ProfileModal;