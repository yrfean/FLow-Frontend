
const Priority = () => {
  return (
    <div className="flex pt-0 mt-0 pb-3 gap-4 items-center justify-center">
      <div className="flex gap-1">
        <div className="w-5 h-5 bg-yellow-100 rounded " />
        <h1 className="font-extralight">low</h1>
      </div>
      <div className="flex gap-1">
        <div className="w-5 h-5 bg-gray-100 rounded " />
        <h1 className="font-extralight">medium</h1>
      </div>
      <div className="flex gap-1">
        <div className="w-5 h-5 bg-red-400 rounded " />
        <h1 className="font-extralight">high</h1>
      </div>
      <div className="flex gap-1">
        <div className="w-5 h-5 bg-violet-500 rounded " />
        <h1 className="font-extralight">urgent</h1>
      </div>
    </div>
  );
};

export default Priority;
