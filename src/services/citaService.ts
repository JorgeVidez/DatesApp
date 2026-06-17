import { createClient } from '@supabase/supabase-js';
import { Cita } from '@/types/cita';

// Inicialización del cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Obtiene todas las citas registradas en la tabla 'citas' de Supabase.
 */
export async function getCitas(): Promise<Cita[]> {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .order('fecha', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error al obtener citas de Supabase:', error.message);
    throw error;
  }

  return (data || []) as Cita[];
}

/**
 * Inserta una nueva cita en la base de datos (sin foto inicialmente).
 */
export async function addCita(cita: Omit<Cita, 'id'>): Promise<Cita> {
  // Generamos un id temporal o dejamos que Supabase asigne un UUID si la tabla usa uuid.
  // Para compatibilidad, si la tabla usa string/varchar ID, podemos enviar un ID generado,
  // pero si usa auto-incremental o UUID de base de datos, omitimos 'id'.
  // Vamos a enviar la cita tal cual. Si la tabla requiere un ID generado del cliente (como el mock original que usaba Date.now().toString()),
  // se lo proporcionamos para evitar fallos si no es un UUID autogenerado.
  const payload = {
    ...cita,
    id: Date.now().toString(), // Mantiene el comportamiento del mock original por compatibilidad con IDs string
  };

  const { data, error } = await supabase
    .from('citas')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error al agregar cita en Supabase:', error.message);
    throw error;
  }

  return data as Cita;
}

/**
 * Actualiza una cita existente en la base de datos.
 */
export async function updateCitaService(cita: Cita): Promise<Cita> {
  const { data, error } = await supabase
    .from('citas')
    .update(cita)
    .eq('id', cita.id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar la cita en Supabase:', error.message);
    throw error;
  }

  return data as Cita;
}

/**
 * Elimina una cita de la base de datos.
 */
export async function deleteCitaService(id: string): Promise<void> {
  const { error } = await supabase
    .from('citas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar la cita en Supabase:', error.message);
    throw error;
  }
}

/**
 * Sube una imagen al bucket público 'fotos-citas' de Supabase Storage
 * y asocia su URL pública a la cita actualizando su campo 'fotoUrl'.
 */
export async function uploadCitaFoto(citaId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'png';
  // Formato de nombre único requerido: id-timestamp.ext
  const fileName = `${citaId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // 1. Subir la imagen al bucket 'fotos-citas'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('fotos-citas')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error al subir imagen al storage de Supabase:', uploadError.message);
    throw uploadError;
  }

  // 2. Obtener la URL pública de la imagen
  const { data: { publicUrl } } = supabase.storage
    .from('fotos-citas')
    .getPublicUrl(filePath);

  // 3. Obtener las fotos existentes de la cita
  const { data: citaData } = await supabase
    .from('citas')
    .select('fotos')
    .eq('id', citaId)
    .single();

  const existingFotos: string[] = (citaData && Array.isArray(citaData.fotos)) 
    ? citaData.fotos 
    : [];

  const updatedFotos = [...existingFotos, publicUrl];

  // 4. Actualizar la cita con el nuevo fotoUrl (portada) y fotos (galería completa) en Supabase
  const { error: updateError } = await supabase
    .from('citas')
    .update({ 
      fotoUrl: publicUrl, 
      fotos: updatedFotos 
    })
    .eq('id', citaId);

  if (updateError) {
    console.error('Error al asociar la foto a la cita en la DB:', updateError.message);
    throw updateError;
  }

  return publicUrl;
}
