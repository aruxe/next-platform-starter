import { useState } from 'react';
import { Card } from 'components/card';

export const metadata = {
  title: 'Spin the Wheel'
};

export default function SpinTheWheelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Spin The Wheel</h1>
      <div className="max-w-3xl mx-auto">
        <SpinWheel />
      </div>
    </div>
  );
}

function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [sectors, setSectors] = useState([
    { id: 1, text: 'Prize 1', color: '#FF6384' },
    { id: 2, text: 'Prize 2', color: '#36A2EB' },
    { id: 3, text: 'Prize 3', color: '#FFCE56' },
    { id: 4, text: 'Prize 4', color: '#4BC0C0' },
    { id: 5, text: 'Prize 5', color: '#9966FF' },
    { id: 6, text: 'Prize 6', color: '#FF9F40' },
  ]);
  const [newSector, setNewSector] = useState('');
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    // Calculate random rotation between 5-10 full rotations plus a random sector
    const sectorSize = 360 / sectors.length;
    const fullRotations = 5 + Math.floor(Math.random() * 5); // 5-10 rotations
    const extraDegrees = Math.floor(Math.random() * 360); // Random sector
    
    const totalRotation = rotation + (fullRotations * 360) + extraDegrees;
    setRotation(totalRotation);
    
    // Calculate which sector the wheel landed on
    setTimeout(() => {
      const finalPosition = totalRotation % 360;
      const sectorIndex = Math.floor(sectors.length - (finalPosition / sectorSize) % sectors.length - 1);
      const actualIndex = (sectorIndex + sectors.length) % sectors.length;
      
      setResult(sectors[actualIndex]);
      setSpinning(false);
    }, 5000); // Match this with the CSS transition time
  };

  const handleAddSector = (e) => {
    e.preventDefault();
    if (newSector.trim() === '') return;
    
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#32CD32', '#FFA07A'];
    
    setSectors([
      ...sectors,
      {
        id: sectors.length + 1,
        text: newSector,
        color: colors[sectors.length % colors.length]
      }
    ]);
    
    setNewSector('');
  };

  const handleRemoveSector = (id) => {
    if (sectors.length <= 2) return; // Need at least 2 sectors
    setSectors(sectors.filter(sector => sector.id !== id));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-4 border-l-transparent border-r-transparent border-t-red-600"></div>
        </div>
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.1, 0.25, 0.1, 1.0)' : 'none'
          }}
        >
          {sectors.map((sector, index) => {
            const angle = 360 / sectors.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;
            
            return (
              <div 
                key={sector.id}
                className="absolute top-0 left-0 w-full h-full"
                style={{ 
                  transform: `rotate(${startAngle}deg)`,
                  backgroundColor: sector.color,
                  clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos((Math.PI * endAngle) / 180)}% ${50 - 50 * Math.sin((Math.PI * endAngle) / 180)}%, 50% 50%)`
                }}
              >
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white font-bold text-center w-20">
                  {sector.text}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full border-4 border-gray-300 z-10"></div>
      </div>

      <div className="mb-8">
        <button 
          onClick={handleSpin}
          disabled={spinning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full disabled:bg-gray-400"
        >
          {spinning ? 'Spinning...' : 'SPIN!'}
        </button>
      </div>

      {result && (
        <Card className="mb-8 w-full max-w-md">
          <h3 className="text-xl font-bold mb-2">Result</h3>
          <div 
            className="text-2xl font-bold py-4 px-4 rounded-lg text-center text-white"
            style={{ backgroundColor: result.color }}
          >
            {result.text}
          </div>
        </Card>
      )}

      <Card className="w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Customize Wheel</h3>
        
        <form onSubmit={handleAddSector} className="mb-4 flex">
          <input
            type="text"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            placeholder="Add new item"
            className="border rounded p-2 flex-grow mr-2"
          />
          <button 
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add
          </button>
        </form>
        
        <div className="space-y-2">
          <h4 className="font-bold">Current Items</h4>
          {sectors.map(sector => (
            <div 
              key={sector.id}
              className="flex justify-between items-center p-2 rounded"
              style={{ backgroundColor: `${sector.color}20` }}
            >
              <span>{sector.text}</span>
              <button 
                onClick={() => handleRemoveSector(sector.id)}
                className="text-red-500 hover:text-red-700"
                disabled={sectors.length <= 2}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
