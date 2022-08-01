import { Grid, Typography } from "@mui/material";

export default function IndexPage() {
	return (
		<Grid container direction="column">
			<Typography variant="h3">
				You tried to access a page that you don&apos;t have enough
				permissions to. Contact tech support if you think this is a
				mistake or go back to the home page
			</Typography>
		</Grid>
	);
}
