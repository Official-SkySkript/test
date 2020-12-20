import {
	Button,
	Divider,
	IconButton,
	InputAdornment,
	makeStyles,
	Paper,
	TextField,
	Toolbar,
	Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Hint from "./Hint";

const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		margin: theme.spacing(2) + "px auto",
	},
	image: {
		position: "absolute",
		top: 0,
		left: 0,
		height: "110%",
		right: 0,
		background: `url(${
			theme.palette.type === "dark" ? "/home-dark.png" : "/home-light.png"
		}) no-repeat center`,
		backgroundSize: "cover",
		zIndex: -1,
		transform: (props) => `translateY(${props.scrollTop / 4}px)`,
	},
	heading: {
		margin: theme.spacing(3, 0),
		whiteSpace: "pre-wrap !important",
		overflowWrap: "anywhere",
		wordBreak: "break-word",
		position: "relative",
		textTransform: "uppercase",
	},
	paper: {
		padding: theme.spacing(2, 4),
	},
}));

export default function Login() {
	const router = useRouter();

	const [email, setEmail] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState("");

	const toggleShowPassword = () => setShowPassword(!showPassword);

	const handleEmailChange = (e) => setEmail(e.target.value);

	const handlePasswordChange = (e) => setPassword(e.target.value);

	const [scrollTop, setScrollTop] = useState(0);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			setScrollTop(window.pageYOffset);
		});
	});

	const classes = useStyles({ scrollTop });

	const [error, setError] = useState("");

	const handleFormSubmit = (e) => {
		e.preventDefault();

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => setError(""))
			.catch((e) => setError(e.message));
	};

	return (
		<>
			<FirebaseAuthConsumer>
				{({ isSignedIn, providerId, user }) => {
					console.log(isSignedIn);
					if (isSignedIn)
						router.push({
							pathname: "/",
						});
				}}
			</FirebaseAuthConsumer>
			<div className={classes.image} />
			<Toolbar />
			<Paper className={classes.paper}>
				<Typography
					variant="h4"
					component="h1"
					className={classes.heading}
				>
					Login
				</Typography>
				<Typography color="textSecondary" paragraph>
					Login to minehut.xyz.
				</Typography>
				<Divider />
				<Hint severity="error">
					This feature is still a work-in-progress! Accounts are{" "}
					<strong>not</strong> currently supported, although we're
					working to bring them as soon as possible.
				</Hint>
				<form onSubmit={handleFormSubmit} className={classes.form}>
					<TextField
						label="Email"
						fullWidth
						value={email}
						onChange={handleEmailChange}
						variant="filled"
					/>
					<TextField
						label="Password"
						type={showPassword ? "text" : "password"}
						fullWidth
						value={password}
						onChange={handlePasswordChange}
						variant="filled"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={toggleShowPassword}>
										{showPassword ? (
											<Visibility />
										) : (
											<VisibilityOff />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Button
						type="submit"
						variant="contained"
						style={{ flexShrink: 0 }}
						color="primary"
						size="large"
					>
						Login
					</Button>
				</form>
				{error && <Hint severity="error">{error}</Hint>}
			</Paper>
		</>
	);
}
