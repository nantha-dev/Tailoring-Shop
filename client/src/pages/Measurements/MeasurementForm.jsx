import { useForm } from 'react-hook-form';
import { measurementService } from '../../services/measurementService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import toast from 'react-hot-toast';

export default function MeasurementForm({ customerId, onSuccess }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        customer: customerId,
        measurements: {
          chest: parseFloat(data.chest) || undefined,
          waist: parseFloat(data.waist) || undefined,
          hip: parseFloat(data.hip) || undefined,
          shoulder: parseFloat(data.shoulder) || undefined,
          neck: parseFloat(data.neck) || undefined,
          sleeveLength: parseFloat(data.sleeveLength) || undefined,
          armRound: parseFloat(data.armRound) || undefined,
          shirtLength: parseFloat(data.shirtLength) || undefined,
          pantLength: parseFloat(data.pantLength) || undefined,
          thigh: parseFloat(data.thigh) || undefined,
          knee: parseFloat(data.knee) || undefined,
          bottom: parseFloat(data.bottom) || undefined,
          inseam: parseFloat(data.inseam) || undefined,
        },
        notes: data.notes,
      };
      await measurementService.create(payload);
      toast.success('Measurement saved');
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fields = ['chest','waist','hip','shoulder','neck','sleeveLength','armRound','shirtLength','pantLength','thigh','knee','bottom','inseam'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      {fields.map(f => (
        <Input key={f} placeholder={f} type="number" step="0.1" {...register(f)} />
      ))}
      <Input placeholder="Notes" {...register('notes')} className="col-span-2" />
      <Button type="submit" className="col-span-2">Save</Button>
    </form>
  );
}