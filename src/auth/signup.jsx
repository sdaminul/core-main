import { useState } from "react";
import './Signup.css';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import {
  Ship,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Ocean Freight",
  "Air Freight",
  "Customs Brokerage",
  "Warehousing",
  "Trucking / Drayage",
  "Freight Forwarding",
];

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Singapore",
  "China",
  "India",
  "Australia",
];

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function SignUp() {
  const [step, setStep] = useState(1); // 1 = role, 2 = account
  const [role, setRole] = useState(null); // "shipper" | "vendor"

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    tradingName: "",
    registeredName: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "",
    stateProvince: "",
    country: "",
    responseTime: "",
    services: [],
    companySummary: "",
    memberOfAssociation: false,
    understandsAnonymousBids: false,
    agreesToFee: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    const value =
      e && e.target
        ? e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
        : e;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleService = (service) => {
    setForm((prev) => {
      const has = prev.services.includes(service);
      return {
        ...prev,
        services: has
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
    setErrors((prev) => ({ ...prev, services: undefined }));
  };

  const chooseRole = (r) => {
    setRole(r);
    setStep(2);
  };

  const goBackToRole = () => {
    setStep(1);
    setErrors({});
  };

  const validateCommon = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!form.password) {
      e.password = "Password is required.";
    } else if (!PASSWORD_RULE.test(form.password)) {
      e.password =
        "At least 8 characters with uppercase, lowercase, and numbers.";
    }
    if (!form.confirmPassword) {
      e.confirmPassword = "Confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const validateVendorExtra = () => {
    const e = {};
    if (!form.tradingName.trim()) e.tradingName = "Trading name is required.";
    if (!form.contactPerson.trim())
      e.contactPerson = "Contact person is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.country) e.country = "Country is required.";
    if (!form.responseTime.trim())
      e.responseTime = "Typical response time is required.";
    if (!form.understandsAnonymousBids)
      e.understandsAnonymousBids = "You must acknowledge this to continue.";
    if (!form.agreesToFee)
      e.agreesToFee = "You must agree to the fee to continue.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const combined = {
      ...validateCommon(),
      ...(role === "vendor" ? validateVendorExtra() : {}),
    };
    setErrors(combined);
    if (Object.keys(combined).length > 0) return;

    setSubmitted(true);
  };

  const getContainerWidth = () => {
    if (submitted) {
      return { maxWidth: "470px" };
    }
    if (step === 1) {
      return { maxWidth: "470px" };
    }
    if (role === "vendor") {
      return { maxWidth: "940px", width: "100%" };
    }
    return { maxWidth: "470px" };
  };

  return (
    <>
      <div className="nexus-signup">
        {/* Sub-nav */}
        <Container className="px-3 px-sm-4 py-3">
          <div className="d-flex justify-content-between align-items-center small">
            <a
              href="./"
              className="link-orange d-flex align-items-center gap-1 text-decoration-none"
              style={{ color: "#94a3b8" }}
            >
              <ArrowLeft size={14} />
              Return to homepage
            </a>
            <div>
              <span
                className={
                  step === 1 ? "step-label-active" : "step-label-inactive"
                }
              >
                1. Role
              </span>
              <span className="text-muted-slate mx-2">—</span>
              <span
                className={
                  step === 2 ? "step-label-active" : "step-label-inactive"
                }
              >
                2. {role === "vendor" ? "Account & Profile" : "Account"}
              </span>
            </div>
          </div>
        </Container>

        {/* Content */}
        <Container className="py-4">
          <Row className="justify-content-center">
            <div style={getContainerWidth()} className="p-0">
              {submitted && (
                <Card className="nexus-panel text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 40,
                      height: 40,
                      background: "rgba(249,115,22,0.2)",
                      color: "#fb923c",
                    }}
                  >
                    <Check size={20} />
                  </div>
                  <h2 className="h4 fw-bold">Account created</h2>
                  <p className="text-muted-slate mb-0">
                    Your {role} account has been created. Check your email to
                    verify before signing in.
                  </p>
                </Card>
              )}

              {!submitted && step === 1 && (
                <Card className="nexus-panel">
                  <div className="login-header">
                    <h1>Create an account</h1>
                    <p>Choose your account type to get started</p>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <RoleCard
                      icon={Ship}
                      title="Shipper"
                      description="Track shipments, manage D&D, and request quotes from service providers."
                      onClick={() => chooseRole("shipper")}
                    />
                    <RoleCard
                      icon={Building2}
                      title="Vendor"
                      description="Receive quote requests, submit bids, and grow your logistics business."
                      onClick={() => chooseRole("vendor")}
                    />
                  </div>

                  <p className="text-center text-muted-slate mt-4 mb-0">
                    Already have an account?{" "}
                    <a href="login" className="link-orange">
                      Sign in
                    </a>
                  </p>
                </Card>
              )}

              {!submitted && step === 2 && (
                <Card className="nexus-panel">
                  <Button
                    variant="link"
                    onClick={goBackToRole}
                    className="p-0 text-decoration-none d-flex align-items-center gap-1 mb-3"
                    style={{ color: "#94a3b8", width: "fit-content" }}
                  >
                    <ArrowLeft size={14} />
                    Back to role selection
                  </Button>

                  <div className="login-header">
                    <h1>Sign up as {role === "shipper" ? "Shipper" : "Vendor"}</h1>
                    <p>{role === "shipper"
                      ? "Fill in your details to create your account."
                      : "Create the account and vendor profile in one step."}</p>
                  </div>

                  <Form noValidate onSubmit={handleSubmit}>
                    {role === "vendor" && (
                      <p className="section-eyebrow text-white mb-2">MANDATORY</p>
                    )}

                    <Row className="g-3 authform">
                      <Col md={role === "vendor" ? 6 : 12}>
                        <Form.Group controlId="fullName">
                          <InputGroup hasValidation>
                            <InputGroup.Text>
                              <i className="ri-user-line"></i>
                            </InputGroup.Text>
                            <Form.Control
                              className="py-2"
                              placeholder="Full Name"
                              value={form.fullName}
                              onChange={update("fullName")}
                              isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.fullName}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={role === "vendor" ? 6 : 12}>
                        <Form.Group controlId="email">
                          <InputGroup hasValidation>
                            <InputGroup.Text>
                              <i className="ri-mail-line"></i>
                            </InputGroup.Text>
                            <Form.Control
                              className="py-2"
                              placeholder="name@company.com"
                              value={form.email}
                              onChange={update("email")}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={role === "vendor" ? 6 : 12}>
                        <Form.Group controlId="password">
                          <InputGroup hasValidation>
                            <InputGroup.Text>
                              <i className="ri-lock-line"></i>
                            </InputGroup.Text>
                            <Form.Control
                              className="py-2"
                              type="password"
                              placeholder="Create a strong password"
                              value={form.password}
                              onChange={update("password")}
                              isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <Form.Text className="text-muted-slate text-xs">
                          At least 8 characters with uppercase, lowercase &
                          numbers
                        </Form.Text>
                      </Col>

                      <Col md={role === "vendor" ? 6 : 12}>
                        <Form.Group controlId="confirmPassword">
                          <InputGroup hasValidation>
                            <InputGroup.Text>
                              <i className="ri-lock-line"></i>
                            </InputGroup.Text>
                            <Form.Control
                              className="py-2"
                              type="password"
                              placeholder="Confirm your password"
                              value={form.confirmPassword}
                              onChange={update("confirmPassword")}
                              isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    {role === "vendor" && (
                      <>
                        <p className="section-eyebrow text-white mt-4 mb-2">
                          TO RECEIVE BID REQUESTS
                        </p>

                        <Row className="g-3">
                          <Col md={4}>
                            <Form.Group controlId="tradingName">
                              <Form.Control
                                className="py-2"
                                placeholder="Trading name *"
                                value={form.tradingName}
                                onChange={update("tradingName")}
                                isInvalid={!!errors.tradingName}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.tradingName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              placeholder="Registered name"
                              value={form.registeredName}
                              onChange={update("registeredName")}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="contactPerson">
                              <Form.Control
                                className="py-2"
                                placeholder="Contact person *"
                                value={form.contactPerson}
                                onChange={update("contactPerson")}
                                isInvalid={!!errors.contactPerson}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.contactPerson}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group controlId="phone">
                              <Form.Control
                                className="py-2"
                                placeholder="Phone *"
                                value={form.phone}
                                onChange={update("phone")}
                                isInvalid={!!errors.phone}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.phone}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                                className="py-2"
                              placeholder="Address"
                              value={form.address}
                              onChange={update("address")}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="city">
                              <Form.Control
                                className="py-2"
                                placeholder="City *"
                                value={form.city}
                                onChange={update("city")}
                                isInvalid={!!errors.city}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.city}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Control
                                className="py-2"
                              placeholder="State / Province"
                              value={form.stateProvince}
                              onChange={update("stateProvince")}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="country">
                              <Form.Select
                                className="py-2"
                                value={form.country}
                                onChange={update("country")}
                                isInvalid={!!errors.country}
                              >
                                <option value="" disabled>
                                  Country *
                                </option>
                                {COUNTRY_OPTIONS.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {errors.country}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="responseTime">
                              <Form.Control
                                className="py-2"
                                placeholder="Typical response time *"
                                value={form.responseTime}
                                onChange={update("responseTime")}
                                isInvalid={!!errors.responseTime}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.responseTime}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Services multi-select */}
                        <Form.Group className="mt-3 position-relative" controlId="services">
                          <i className="ri-arrow-down-s-line poeyx"></i>
                          <details
                            className="ouegsa">
                            <summary
                              style={{ cursor: "pointer", listStyle: "none" }}
                              className="text-muted-slate"
                            >
                              {form.services.length > 0
                                ? form.services.join(", ")
                                : "Select services offered"}
                            </summary>
                            <div className="mt-2 pt-2 border-top border-secondary d-flex flex-column gap-2">
                              {SERVICE_OPTIONS.map((s) => (
                                <Form.Check
                                  key={s}
                                  type="checkbox"
                                  id={`service-${s}`}
                                  label={s}
                                  checked={form.services.includes(s)}
                                  onChange={() => toggleService(s)}
                                />
                              ))}
                            </div>
                          </details>
                        </Form.Group>

                        <Form.Group className="mt-3" controlId="companySummary">
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Company summary"
                            value={form.companySummary}
                            onChange={update("companySummary")}
                          />
                        </Form.Group>

                        <div className="mt-3 d-flex flex-column gap-3">
                          <div className="checkpanel">
                            <Form.Check
                              type="checkbox"
                              id="memberOfAssociation"
                              label="Member of an association"
                              checked={form.memberOfAssociation}
                              onChange={update("memberOfAssociation")}
                            />
                          </div>

                          <div className="checkpanel">
                            <Form.Check
                              type="checkbox"
                              id="understandsAnonymousBids"
                              label="I understand bids remain anonymous until accepted."
                              checked={form.understandsAnonymousBids}
                              onChange={update("understandsAnonymousBids")}
                              isInvalid={!!errors.understandsAnonymousBids}
                              feedback={errors.understandsAnonymousBids}
                              feedbackType="invalid"
                            />
                          </div>

                          <div className="checkpanel">
                            <Form.Check
                              type="checkbox"
                              id="agreesToFee"
                              label="I agree to 3% fee per successful bid."
                              checked={form.agreesToFee}
                              onChange={update("agreesToFee")}
                              isInvalid={!!errors.agreesToFee}
                              feedback={errors.agreesToFee}
                              feedbackType="invalid"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="btn-orange w-100 mt-4 d-flex align-items-center justify-content-center gap-2 py-2"
                    >
                      Create account
                      <Check size={16} />
                    </Button>

                    <p className="text-center text-muted-slate mt-3 mb-0">
                      Already have an account?{" "}
                      <a href="login" className="link-orange">
                        Sign In
                      </a>
                    </p>
                  </Form>
                </Card>
              )}
            </div>
          </Row>
        </Container>
      </div>
      {/* ═══ FOOTER ═══ */}
      <footer className="cv-footer">
        <Container className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          <div>© {new Date().getFullYear()} 3pl3sixty LLC, Wyoming, 82801. All rights reserved.</div>
        </Container>
      </footer>
    </>
  );
}

function RoleCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="role-card p-3 p-sm-4 d-flex gap-3 align-items-start"
    >
      <div className="role-icon">
        <Icon size={20} />
      </div>
      <div className="flex-grow-1">
        <p className="fw-semibold mb-1" style={{ color: "var(--cv-text-1)" }}>
          {title}
        </p>
        <p className="text-muted-slate mb-0 small">{description}</p>
      </div>
      <ArrowRight size={20} className="mt-1 text-muted-slate icow" />
    </button>
  );
}