const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
