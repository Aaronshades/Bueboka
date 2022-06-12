import React, { useEffect, useState } from "react";
import { formList, useForm } from "@mantine/form";
import { AlertCircle, Plus, Trash, Ruler2, BorderOuter, Calculator } from 'tabler-icons-react';
import { ActionIcon, Alert, Button, Loader, Modal, Table, TextInput } from "@mantine/core";

import { IAimDistanceMark, IAimDistanceMarkValue, Status } from "../../../models";
import { useBallisticsParams, useStoreBallistics, useFetchBallistics } from "../../../helpers/hooks/";
import styles from './CalculateForm.module.css';

const CalculateForm = () => {

	const form = useForm({
		initialValues: {
			marks: formList<IAimDistanceMarkValue>([]),
		},
	});

	const [opened, setOpened] = useState(false);
	const { status, calculateBallisticsParams } = useBallisticsParams();
	const { ballistics, getBallistics } = useFetchBallistics();
	const { storeBallistics } = useStoreBallistics();
	const [aimValue, setAimValue] = useState<string>('');
	const [aimError, setAimError] = useState(false);
	const [distanceError, setDistanceError] = useState(false);
	const [distanceValue, setDistanceValue] = useState<string>('');

	const sendMarks = async (marks: IAimDistanceMarkValue[]) => {
		const body: IAimDistanceMark = {
			marks: [...marks.map((mark) => parseFloat(mark.aim))],
			given_distances: [...marks.map((mark) => parseFloat(mark.distance))],
			bow_category: "recurve",
			interval_sight_measured: 5.0,
			interval_sight_real: 5.3,
			arrow_diameter_mm: 5.69,
			arrow_mass_gram: 21.2,
			length_eye_sight_cm: 97.0,
			length_nock_eye_cm: 12.0,
			feet_behind_or_center: "behind"
		}
		try {
			const aimMarkResponse = await calculateBallisticsParams(body);
			if (aimMarkResponse) {
				await storeBallistics(aimMarkResponse);
			}
		} catch (error) {
			console.log("NOT WORKING: ", error)
		}
	}

	useEffect(() => {
		if (form.values.marks.length > 0) {
			sendMarks(form.values.marks).then(() => {
				getBallistics();
			})
		}
	}, [form.values.marks])

	const handleDistanceChange = (event: React.FormEvent<HTMLInputElement>) => {
		setDistanceValue(event.currentTarget.value)
	};

	const handleAimChange = (event: React.FormEvent<HTMLInputElement>) => {
		setAimValue(event.currentTarget.value)
	};
	const handleAddMarks = () => {
		if (!aimValue) {
			setAimError(true);
		}
		if (!distanceValue) {
			setDistanceError(true);
		}
		if (aimValue && distanceValue) {
			form.addListItem('marks', { aim: aimValue, distance: distanceValue })
			setAimValue('');
			setDistanceValue('');
		}
	};

	const renderCalculatedMarks = (index: number) => {
		if (ballistics?.calculated_marks) {
			return ballistics.calculated_marks[index].toFixed(2)
		}
	}

	const renderGivenMark = (index: number) => {
		if (ballistics) {
			return <td>{ballistics.given_marks[index]}</td>
		}
	}

/*	const renderDeviationAlert = (index: number) => {
		if (resultMarks?.calculated_marks) {
			const deviationValue = parseFloat(resultMarks.marks_deviation[index].toFixed(2));
			if (parseFloat(form.values.marks[index].aim) - deviationValue > 0.2 ||
				parseFloat(form.values.marks[index].aim) - deviationValue < -0.2) {
				console.log(deviationValue)
				return (
					<AlertTriangle onClick={() => setOpened(true)} color="orange" />
				)
			} else {
				return null;
			}
		}
	}*/

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<TextInput
					value={distanceValue}
					onChange={handleDistanceChange}
					className={styles.label}
					name="aimDistance"
					label="Avstand"
					error={distanceError ? "Fyll inn avstanden først" : null}
					onFocus={() => setDistanceError(false)}
				/>
				<TextInput
					value={aimValue}
					onChange={handleAimChange}
					className={styles.label}
					name="aim"
					label="Merke"
					error={aimError ? "Fyll inn merke først" : null}
					onFocus={() => setAimError(false)}
				/>
				<Button loading={status === Status.Pending} onClick={handleAddMarks} type="button">
					{status === Status.Pending ? 'Laster' : <> <Plus />  Legg til </>}
				</Button>
			</form>
				<Table striped verticalSpacing="sm" fontSize="md">
					<thead>
						<tr>
							<td><Ruler2 /> Avstand</td>
							<td><BorderOuter /> Merke</td>
							<td><Calculator /> Beregnet</td>
						</tr>
					</thead>
					<tbody>
						{ballistics && ballistics.given_distance.map((distance, index) => (
							<tr key={index}>
								<td>{distance.toFixed(2)}</td>
								<td>{renderGivenMark(index)}</td>
								<td>{status === Status.Pending ? <Loader size={16} /> : renderCalculatedMarks(index)}</td>
								<td>
									<ActionIcon
											title="Fjern merke"
											style={{ marginLeft: "auto" }}
											color="red"
											variant="hover"
											onClick={() => form.removeListItem('marks', index)}
									>
										<Trash size={16} />
									</ActionIcon>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				{form.values.marks.length === 0 && (
					<Alert mt={8} icon={<AlertCircle size={16} />} title="Her var det tomt!" color="blue">
						Legg inn siktemerker og send dem inn til beregning
					</Alert>
				)}
			{opened && (
				<>
					<Modal
						opened={opened}
						onClose={() => setOpened(false)}
						title="Stor avvik"
						centered
					>
						Her avviker siktemerket du har sendt inn med beregnet sikemerke.
					</Modal>
				</>
			)}
		</div>
	);
};

export default CalculateForm;
