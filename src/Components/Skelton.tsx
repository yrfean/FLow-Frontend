import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Skelton = () => {
  return (
    <div className="w-full p-7">
      <Skeleton width={999} height={200} />
      <Skeleton width={999} height={50} className="mt-2" />
      <div className="flex gap-3 w-full mt-2">
        <Skeleton width={330} height={300} />
        <Skeleton width={330} height={300} />
        <Skeleton width={330} height={300} />
      </div>
    </div>
  );
};

export default Skelton;
