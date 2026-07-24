import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { measurementService } from '../../services/measurementService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatDate } from '../../utils/formatDate';
import { Separator } from '../../components/ui/separator';

export default function MeasurementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [measurement, setMeasurement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurement = async () => {
      try {
        const res = await measurementService.getById(id);
        setMeasurement(res.measurement);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeasurement();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!measurement) return <div className="p-8">Measurement not found.</div>;

  const m = measurement.measurements || {};

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="outline" onClick={() => navigate(-1)}>← Back</Button>

      <Card>
        <CardHeader>
          <CardTitle>Measurement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span className="font-semibold">Customer:</span> {measurement.customer?.name || 'N/A'}</div>
            <div><span className="font-semibold">Date:</span> {formatDate(measurement.date)}</div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {m.chest && <div><span className="text-sm text-muted-foreground">Chest</span><br/>{m.chest}</div>}
            {m.waist && <div><span className="text-sm text-muted-foreground">Waist</span><br/>{m.waist}</div>}
            {m.hip && <div><span className="text-sm text-muted-foreground">Hip</span><br/>{m.hip}</div>}
            {m.shoulder && <div><span className="text-sm text-muted-foreground">Shoulder</span><br/>{m.shoulder}</div>}
            {m.neck && <div><span className="text-sm text-muted-foreground">Neck</span><br/>{m.neck}</div>}
            {m.sleeveLength && <div><span className="text-sm text-muted-foreground">Sleeve Length</span><br/>{m.sleeveLength}</div>}
            {m.armRound && <div><span className="text-sm text-muted-foreground">Arm Round</span><br/>{m.armRound}</div>}
            {m.shirtLength && <div><span className="text-sm text-muted-foreground">Shirt Length</span><br/>{m.shirtLength}</div>}
            {m.pantLength && <div><span className="text-sm text-muted-foreground">Pant Length</span><br/>{m.pantLength}</div>}
            {m.thigh && <div><span className="text-sm text-muted-foreground">Thigh</span><br/>{m.thigh}</div>}
            {m.knee && <div><span className="text-sm text-muted-foreground">Knee</span><br/>{m.knee}</div>}
            {m.bottom && <div><span className="text-sm text-muted-foreground">Bottom</span><br/>{m.bottom}</div>}
            {m.inseam && <div><span className="text-sm text-muted-foreground">Inseam</span><br/>{m.inseam}</div>}
          </div>

          {measurement.notes && (
            <>
              <Separator className="my-4" />
              <div><span className="font-semibold">Notes:</span> {measurement.notes}</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}