import { Fragment } from "react";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Overlay({ isOpen, onClose, children }: OverlayProps) {
  return (
    <Fragment>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background */}
          <div
            className="fixed inset-0 bg-black/10 cursor-pointer z-40"
            onClick={onClose}
          />

          {/* Container */}
          <div className="relative z-50 bg-white p-8 w-3/4 h-5/6 rounded shadow-lg max-w-full max-h-full overflow-auto">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-xl font-bold text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;
