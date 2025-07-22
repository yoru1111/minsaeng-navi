import Header from "../components/Header";
import DirectionsBox from "../components/DirectionsBox";
import MapControls from "../components/MapControls";

function Tab2MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute top-4 left-4 z-10">
          <DirectionsBox />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <MapControls />
        </div>
        <div className="w-full h-full flex justify-center items-center text-gray-400 text-xl">
          [ 여기에 지도가 들어갑니다 ]
        </div>
      </div>
    </div>
  );
}

export default Tab2MapPage;
