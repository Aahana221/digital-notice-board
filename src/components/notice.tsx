import { supabase } from './utils/supabase';

 const [supabaseTodos, setSupabaseTodos] = useState<any[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      const { data, error } = await supabase.from('todos').select('id,name');

      if (error) {
        console.error('Unable to load Supabase todos:', error.message);
        return;
      }

      if (data) {
        setSupabaseTodos(data);
      }
    };

    loadTodos();
  }, []);
   return (
    
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Supabase sample data
          </h2>
          <ul className="mt-3 space-y-2">
            {supabaseTodos.length === 0 ? (
              <li className="text-sm text-slate-500 dark:text-slate-400">No todos loaded yet.</li>
            ) : (
              supabaseTodos.map((todo) => (
                <li key={todo.id} className="text-sm text-slate-700 dark:text-slate-300">
                  {todo.name}
                </li>
              ))
            )}
          </ul>