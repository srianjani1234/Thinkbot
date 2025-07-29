import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("All Creations:", res.data.creations); // debug log

      if (res.data.success) {
        // Only filter image creations with valid URL
        const filtered = (res.data.creations || []).filter(
          (c) => c.type === 'image' && typeof c.content === 'string' && c.content.startsWith('http')
        );

        console.log("Filtered Images:", filtered); // debug log

        setCreations(filtered);
      } else {
        toast.error(res.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch creations.');
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      const res = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchCreations();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Like failed.');
    }
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  return !loading ?  (
    <div className=" ml-60 mt-16 min-h-screen overflow-y-auto flex-1 h-full flex flex-col gap-4 p-6 h-screen overflow-y-auto p-6">
      <h2 className="text-xl font-semibold">🖼️ Community Creations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : creations.length === 0 ? (
        <p>No published image creations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
          {creations.map((creation) => (
            <div key={creation.id} className="relative group">
              <img
                src={creation.content}
                alt={creation.prompt || 'AI-generated image'}
                className="w-full h-64 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 text-white flex flex-col justify-end p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm truncate">{creation.prompt}</p>
                <div className="flex justify-between items-center mt-2">
                  <p>{creation.likes?.length || 0}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${
                      creation.likes?.includes(user?.id)
                        ? 'fill-red-500 text-red-600'
                        : 'text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
};

export default Community;
