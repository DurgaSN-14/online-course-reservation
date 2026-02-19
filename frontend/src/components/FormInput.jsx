import { forwardRef } from "react";

const FormInput = forwardRef(
    ({ label, type = "text", icon: Icon, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="text-sm text-gray-300 font-medium mb-1 block">{label}</label>

                <div
                    className={`flex items-center bg-gray-900/60 border rounded-xl px-4 py-3 transition
          ${error
                            ? "border-red-500 focus-within:border-red-500"
                            : "border-gray-700 focus-within:border-purple-500"
                        }`}
                >
                    {Icon && <Icon size={18} className="text-gray-400 mr-3" />}

                    <input
                        ref={ref}
                        type={type}
                        className="bg-transparent w-full outline-none text-sm placeholder-gray-500"
                        {...props}
                    />
                </div>

                {error && (
                    <p className="text-xs text-red-400 mt-1">{error.message}</p>
                )}
            </div>
        );
    }
);

export default FormInput;