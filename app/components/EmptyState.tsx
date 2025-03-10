const EmptyState = () => {
  return (
    <div
      className="
        px-4 
        py-10 
        sm:px-6 
        lg:px-8 
        lg:py-6 
        h-full 
        flex 
        justify-center 
        items-center 
        bg-gray-100
        dark:bg-dusk
      "
    >
      <div className="text-center items-center flex flex-col">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-200">
          选择一个聊天或开始一个新的对话
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
